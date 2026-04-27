import { v } from 'convex/values'

import { internalMutation, mutation, query } from './_generated/server'
import { internal } from './_generated/api'
import { ensureDefaultHospitalDirectory } from './doctors'
import { getViewerAuthProfile, requireAdminProfile, requireFrontDeskOrAdminProfile } from './portalAuth'

const source = v.union(v.literal('web'), v.literal('android'), v.literal('ios'))
const status = v.union(v.literal('pending'), v.literal('confirmed'), v.literal('completed'), v.literal('cancelled'))
const paymentStatus = v.union(
  v.literal('not_required'),
  v.literal('pending'),
  v.literal('paid'),
  v.literal('failed'),
  v.literal('refunded')
)

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, '').trim()
}

function getManualPaymentStatus(amountPaise: number, totalPaidPaise: number) {
  if (amountPaise <= 0) {
    return 'not_required' as const
  }

  return totalPaidPaise >= amountPaise ? 'paid' as const : 'pending' as const
}

async function getAppointmentByReference(ctx: any, appointmentId: string) {
  return await ctx.db
    .query('appointments')
    .withIndex('by_appointment_id', (query: any) => query.eq('appointmentId', appointmentId))
    .unique()
}

async function getDoctorProfileBySlug(ctx: any, slug: string) {
  return await ctx.db
    .query('doctorProfiles')
    .withIndex('by_slug', (query: any) => query.eq('slug', slug))
    .unique()
}

async function buildDoctorRoomMaps(ctx: any) {
  const [doctorProfiles, rooms] = await Promise.all([
    ctx.db.query('doctorProfiles').collect(),
    ctx.db.query('rooms').collect(),
  ])

  return {
    doctorsById: new Map(doctorProfiles.map((doctor: any) => [doctor._id, doctor])),
    doctorsBySlug: new Map(doctorProfiles.map((doctor: any) => [doctor.slug, doctor])),
    roomsById: new Map(rooms.map((room: any) => [room._id, room])),
  }
}

function enrichAppointmentRecord(appointment: any, maps: { doctorsById: Map<any, any>; doctorsBySlug: Map<any, any>; roomsById: Map<any, any> }) {
  const doctor = appointment.doctorProfileId
    ? maps.doctorsById.get(appointment.doctorProfileId) ?? maps.doctorsBySlug.get(appointment.doctorId)
    : maps.doctorsBySlug.get(appointment.doctorId)
  const room = appointment.roomId
    ? maps.roomsById.get(appointment.roomId)
    : doctor?.roomId
      ? maps.roomsById.get(doctor.roomId)
      : null

  return {
    ...appointment,
    doctorProfileId: appointment.doctorProfileId ?? doctor?._id,
    doctorName: doctor?.name,
    roomId: appointment.roomId ?? doctor?.roomId,
    roomCode: room?.code,
    roomLabel: room?.label,
  }
}

async function ensureViewerPatientProfile(ctx: any, args: { patientName: string; patientEmail: string; patientPhone: string }) {
  const { authUser, profile } = await getViewerAuthProfile(ctx)
  if (!authUser) {
    return null
  }

  if (profile) {
    await ctx.db.patch(profile._id, {
      name: args.patientName.trim(),
      email: args.patientEmail,
      phone: args.patientPhone,
      image: authUser.image ?? profile.image,
      role: profile.role ?? 'patient',
    })

    return await ctx.db.get(profile._id)
  }

  const insertedId = await ctx.db.insert('users', {
    authUserId: authUser.id,
    doctorProfileId: undefined,
    name: args.patientName.trim(),
    email: args.patientEmail,
    phone: args.patientPhone,
    image: authUser.image ?? undefined,
    role: 'patient',
  })

  return await ctx.db.get(insertedId)
}

async function createAppointmentRecord(
  ctx: any,
  args: {
    patientName: string
    patientEmail: string
    patientPhone: string
    doctorProfileId: any
    date: string
    timeSlot: string
    notes?: string
    amountPaise: number
    totalPaidPaise?: number
    source: 'web' | 'android' | 'ios'
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    userId?: any
  }
) {
  const doctorProfile = await ctx.db.get(args.doctorProfileId)
  if (!doctorProfile || !doctorProfile.isActive) {
    throw new Error('The selected doctor profile is unavailable.')
  }

  const appointmentId = `RRD-${Date.now().toString().slice(-8)}`
  const createdAt = Date.now()
  const requiresPayment = args.amountPaise > 0
  const totalPaidPaise = Math.max(0, args.totalPaidPaise ?? 0)

  const id = await ctx.db.insert('appointments', {
    patientName: args.patientName.trim(),
    patientEmail: args.patientEmail,
    patientPhone: args.patientPhone,
    department: doctorProfile.department,
    doctorId: doctorProfile.slug,
    doctorProfileId: doctorProfile._id,
    roomId: doctorProfile.roomId,
    date: args.date,
    timeSlot: args.timeSlot,
    status: args.status,
    appointmentId,
    notes: args.notes,
    amountPaise: args.amountPaise,
    totalPaidPaise,
    paymentStatus: requiresPayment ? getManualPaymentStatus(args.amountPaise, totalPaidPaise) : 'not_required',
    paymentOrderId: undefined,
    paymentId: undefined,
    source: args.source,
    createdAt,
    userId: args.userId,
    notificationStatus: 'idle',
  })

  return {
    appointmentId,
    id,
    confirmedImmediately: args.status === 'confirmed' && !requiresPayment,
    requiresPayment,
  }
}

export const createBooking = mutation({
  args: {
    patientName: v.string(),
    patientEmail: v.string(),
    patientPhone: v.string(),
    department: v.string(),
    doctorId: v.string(),
    date: v.string(),
    timeSlot: v.string(),
    notes: v.optional(v.string()),
    amountPaise: v.number(),
    source,
  },
  handler: async (ctx, args) => {
    const patientEmail = normalizeEmail(args.patientEmail)
    const patientPhone = normalizePhone(args.patientPhone)
    let doctorProfile = await getDoctorProfileBySlug(ctx, args.doctorId)

    if (!doctorProfile) {
      await ensureDefaultHospitalDirectory(ctx)
      doctorProfile = await getDoctorProfileBySlug(ctx, args.doctorId)
    }

    if (!doctorProfile) {
      throw new Error('Please select a valid doctor or department.')
    }

    const viewerProfile = await ensureViewerPatientProfile(ctx, {
      patientName: args.patientName,
      patientEmail,
      patientPhone,
    })

    const booking = await createAppointmentRecord(ctx, {
      patientName: args.patientName,
      patientEmail,
      patientPhone,
      doctorProfileId: doctorProfile._id,
      date: args.date,
      timeSlot: args.timeSlot,
      notes: args.notes?.trim() || undefined,
      amountPaise: args.amountPaise,
      source: args.source,
      status: 'confirmed',
      userId: viewerProfile?._id,
    })

    await ctx.scheduler.runAfter(0, internal.notifications.sendBookingConfirmation, {
      appointmentId: booking.appointmentId,
      patientName: args.patientName.trim(),
      patientEmail,
      patientPhone,
      date: args.date,
      timeSlot: args.timeSlot,
      department: doctorProfile.department,
      doctorName: doctorProfile.name,
    })

    return booking
  },
})

export const createManagedBooking = mutation({
  args: {
    patientName: v.string(),
    patientEmail: v.string(),
    patientPhone: v.string(),
    doctorProfileId: v.id('doctorProfiles'),
    date: v.string(),
    timeSlot: v.string(),
    notes: v.optional(v.string()),
    amountPaise: v.number(),
    totalPaidPaise: v.optional(v.number()),
    status,
  },
  handler: async (ctx, args) => {
    await requireAdminProfile(ctx)

    return await createAppointmentRecord(ctx, {
      patientName: args.patientName,
      patientEmail: normalizeEmail(args.patientEmail),
      patientPhone: normalizePhone(args.patientPhone),
      doctorProfileId: args.doctorProfileId,
      date: args.date,
      timeSlot: args.timeSlot,
      notes: args.notes?.trim() || undefined,
      amountPaise: args.amountPaise,
      totalPaidPaise: Math.max(0, args.totalPaidPaise ?? 0),
      source: 'web',
      status: args.status,
    })
  },
})

export const updateManagedBooking = mutation({
  args: {
    appointmentDocId: v.id('appointments'),
    patientName: v.string(),
    patientEmail: v.string(),
    patientPhone: v.string(),
    doctorProfileId: v.id('doctorProfiles'),
    date: v.string(),
    timeSlot: v.string(),
    notes: v.optional(v.string()),
    amountPaise: v.number(),
    totalPaidPaise: v.optional(v.number()),
    status,
    paymentStatus,
  },
  handler: async (ctx, args) => {
    await requireAdminProfile(ctx)

    const appointment = await ctx.db.get(args.appointmentDocId)
    if (!appointment) {
      throw new Error('Appointment not found.')
    }

    const doctorProfile = await ctx.db.get(args.doctorProfileId)
    if (!doctorProfile) {
      throw new Error('Doctor profile not found.')
    }

    await ctx.db.patch(args.appointmentDocId, {
      patientName: args.patientName.trim(),
      patientEmail: normalizeEmail(args.patientEmail),
      patientPhone: normalizePhone(args.patientPhone),
      department: doctorProfile.department,
      doctorId: doctorProfile.slug,
      doctorProfileId: doctorProfile._id,
      roomId: doctorProfile.roomId,
      date: args.date,
      timeSlot: args.timeSlot,
      notes: args.notes?.trim() || undefined,
      amountPaise: args.amountPaise,
      totalPaidPaise: Math.max(0, args.totalPaidPaise ?? 0),
      status: args.status,
      paymentStatus: getManualPaymentStatus(args.amountPaise, Math.max(0, args.totalPaidPaise ?? 0)),
    })

    return await ctx.db.get(args.appointmentDocId)
  },
})

export const updateManualPayment = mutation({
  args: {
    appointmentDocId: v.id('appointments'),
    totalPaidPaise: v.number(),
  },
  handler: async (ctx, args) => {
    await requireFrontDeskOrAdminProfile(ctx)

    const appointment = await ctx.db.get(args.appointmentDocId)
    if (!appointment) {
      throw new Error('Appointment not found.')
    }

    const totalPaidPaise = Math.max(0, Math.round(args.totalPaidPaise))
    await ctx.db.patch(args.appointmentDocId, {
      totalPaidPaise,
      paymentStatus: getManualPaymentStatus(appointment.amountPaise, totalPaidPaise),
    })

    return await ctx.db.get(args.appointmentDocId)
  },
})

export const deleteManagedBooking = mutation({
  args: {
    appointmentDocId: v.id('appointments'),
  },
  handler: async (ctx, args) => {
    await requireAdminProfile(ctx)

    const appointment = await ctx.db.get(args.appointmentDocId)
    if (!appointment) {
      throw new Error('Appointment not found.')
    }

    await ctx.db.delete(args.appointmentDocId)
    return { success: true as const }
  },
})

export const listByPatientEmail = query({
  args: {
    patientEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const maps = await buildDoctorRoomMaps(ctx)
    const patientEmail = args.patientEmail ? normalizeEmail(args.patientEmail) : undefined
    const appointments = patientEmail !== undefined
      ? await ctx.db
          .query('appointments')
          .withIndex('by_patient_email', (query) => query.eq('patientEmail', patientEmail))
          .order('desc')
          .take(25)
      : await ctx.db.query('appointments').order('desc').take(20)

    return appointments.map((appointment: any) => enrichAppointmentRecord(appointment, maps))
  },
})

export const listForViewer = query({
  args: {},
  handler: async (ctx) => {
    const { authUser, profile } = await getViewerAuthProfile(ctx)
    if (!authUser) {
      return []
    }

    const maps = await buildDoctorRoomMaps(ctx)

    if (profile?.role === 'admin' || profile?.role === 'frontDesk') {
      const adminAppointments = await ctx.db.query('appointments').order('desc').take(50)
      return adminAppointments.map((appointment: any) => enrichAppointmentRecord(appointment, maps))
    }

    if (profile?.role === 'doctor' && profile.doctorProfileId) {
      const doctorProfile = maps.doctorsById.get(profile.doctorProfileId) ?? null
      const directAssignments = await ctx.db
        .query('appointments')
        .withIndex('by_doctor_profile_id', (query) => query.eq('doctorProfileId', profile.doctorProfileId))
        .order('desc')
        .take(50)

      const fallbackAssignments = doctorProfile
        ? (await ctx.db.query('appointments').order('desc').take(100)).filter(
            (appointment: any) => !appointment.doctorProfileId && appointment.doctorId === doctorProfile.slug
          )
        : []

      const merged = [...directAssignments, ...fallbackAssignments]
      const unique = Array.from(new Map(merged.map((appointment: any) => [appointment._id, appointment])).values())
      return unique.map((appointment: any) => enrichAppointmentRecord(appointment, maps))
    }

    if (profile) {
      const appointments = await ctx.db
        .query('appointments')
        .withIndex('by_user_id', (query) => query.eq('userId', profile._id))
        .order('desc')
        .take(50)

      if (appointments.length > 0) {
        return appointments.map((appointment: any) => enrichAppointmentRecord(appointment, maps))
      }

      if (profile.email) {
        const byEmail = await ctx.db
          .query('appointments')
          .withIndex('by_patient_email', (query) => query.eq('patientEmail', normalizeEmail(profile.email)))
          .order('desc')
          .take(25)

        return byEmail.map((appointment: any) => enrichAppointmentRecord(appointment, maps))
      }
    }

    if (authUser.email) {
      const byEmail = await ctx.db
        .query('appointments')
        .withIndex('by_patient_email', (query) => query.eq('patientEmail', normalizeEmail(authUser.email)))
        .order('desc')
        .take(25)

      return byEmail.map((appointment: any) => enrichAppointmentRecord(appointment, maps))
    }

    return []
  },
})

export const listQueueByDate = query({
  args: {
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const { profile } = await getViewerAuthProfile(ctx)
    const maps = await buildDoctorRoomMaps(ctx)

    const baseAppointments = await ctx.db
      .query('appointments')
      .withIndex('by_date', (query) => query.eq('date', args.date))
      .order('asc')
      .take(50)

    if (profile?.role === 'admin' || profile?.role === 'frontDesk') {
      return baseAppointments.map((appointment: any) => enrichAppointmentRecord(appointment, maps))
    }

    if (profile?.role === 'doctor' && profile.doctorProfileId) {
      const doctorProfile = maps.doctorsById.get(profile.doctorProfileId) ?? null
      const filtered = baseAppointments.filter(
        (appointment: any) =>
          appointment.doctorProfileId === profile.doctorProfileId ||
          (!!doctorProfile && !appointment.doctorProfileId && appointment.doctorId === doctorProfile.slug)
      )

      return filtered.map((appointment: any) => enrichAppointmentRecord(appointment, maps))
    }

    return []
  },
})

export const getPaymentCheckoutDetails = query({
  args: {
    appointmentId: v.string(),
  },
  handler: async (ctx, args) => {
    const { authUser, profile } = await getViewerAuthProfile(ctx)
    if (!authUser) {
      throw new Error('You must be signed in to pay for an appointment.')
    }

    const appointment = await getAppointmentByReference(ctx, args.appointmentId)
    if (!appointment) {
      throw new Error('Appointment not found.')
    }

    const canAccess =
      profile?.role === 'admin' ||
      appointment.userId === profile?._id ||
      (!!authUser.email && normalizeEmail(appointment.patientEmail) === normalizeEmail(authUser.email))

    if (!canAccess) {
      throw new Error('You do not have access to this appointment payment.')
    }

    if (appointment.amountPaise <= 0) {
      throw new Error('This appointment has no payment due.')
    }

    if (appointment.paymentStatus === 'paid') {
      throw new Error('This appointment is already paid.')
    }

    const maps = await buildDoctorRoomMaps(ctx)
    return enrichAppointmentRecord(appointment, maps)
  },
})

export const markPaymentInitiated = internalMutation({
  args: {
    appointmentId: v.string(),
    paymentOrderId: v.string(),
  },
  handler: async (ctx, args) => {
    const appointment = await getAppointmentByReference(ctx, args.appointmentId)

    if (!appointment) {
      throw new Error('Appointment not found')
    }

    await ctx.db.patch(appointment._id, {
      paymentOrderId: args.paymentOrderId,
      paymentStatus: 'pending',
    })

    return { ok: true as const }
  },
})

export const finalizeBookingConfirmation = internalMutation({
  args: {
    appointmentId: v.string(),
    paymentOrderId: v.optional(v.string()),
    paymentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const appointment = await getAppointmentByReference(ctx, args.appointmentId)

    if (!appointment) {
      throw new Error('Appointment not found')
    }

    const needsPayment = appointment.amountPaise > 0
    const notificationStatus = appointment.notificationStatus ?? 'idle'
    const nextNotificationStatus = notificationStatus === 'idle' ? 'pending' : notificationStatus

    await ctx.db.patch(appointment._id, {
      status: 'confirmed',
      paymentStatus: needsPayment ? 'paid' : 'not_required',
      paymentOrderId: args.paymentOrderId ?? appointment.paymentOrderId,
      paymentId: args.paymentId ?? appointment.paymentId,
      notificationStatus: nextNotificationStatus,
      notificationError: undefined,
    })

    const updated = await ctx.db.get(appointment._id)
    if (!updated) {
      throw new Error('Updated appointment not found')
    }

    return {
      appointment: updated,
      shouldNotify: notificationStatus === 'idle',
    }
  },
})

export const markPaymentFailed = internalMutation({
  args: {
    appointmentId: v.string(),
    paymentOrderId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const appointment = await getAppointmentByReference(ctx, args.appointmentId)

    if (!appointment) {
      throw new Error('Appointment not found')
    }

    await ctx.db.patch(appointment._id, {
      paymentOrderId: args.paymentOrderId ?? appointment.paymentOrderId,
      paymentStatus: 'failed',
    })

    return { ok: true as const }
  },
})

export const markConfirmationNotification = internalMutation({
  args: {
    appointmentId: v.string(),
    status: v.union(v.literal('sent'), v.literal('skipped'), v.literal('failed')),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const appointment = await getAppointmentByReference(ctx, args.appointmentId)

    if (!appointment) {
      throw new Error('Appointment not found')
    }

    await ctx.db.patch(appointment._id, {
      notificationStatus: args.status,
      confirmationSentAt:
        args.status === 'sent' || args.status === 'skipped'
          ? Date.now()
          : appointment.confirmationSentAt,
      notificationError: args.error,
    })

    return { ok: true as const }
  },
})
