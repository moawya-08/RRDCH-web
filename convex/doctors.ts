import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { getViewerAuthProfile, requireAdminProfile } from './portalAuth'

export const defaultRooms = [
  { code: 'A-201', label: 'General Dentistry Chair Block', floor: '2', wing: 'A' },
  { code: 'B-104', label: 'Orthodontics Review Suite', floor: '1', wing: 'B' },
  { code: 'C-305', label: 'Periodontology Clinic', floor: '3', wing: 'C' },
  { code: 'OT-2', label: 'Maxillofacial Procedure Theatre', floor: 'Ground', wing: 'OT' },
  { code: 'KIDS-3', label: 'Pedodontics Bay', floor: '1', wing: 'Kids' },
  { code: 'D-112', label: 'Prosthodontics Restorative Suite', floor: '1', wing: 'D' },
] as const

export const defaultDoctors = [
  {
    slug: 'general-dentistry',
    name: 'Dr. Priya Sharma',
    department: 'General Dentistry',
    specialty: 'Emergency consults and restorative care',
    shift: '08:30 - 13:00',
    roomCode: 'A-201',
  },
  {
    slug: 'orthodontics',
    name: 'Dr. Rahul Kumar',
    department: 'Orthodontics',
    specialty: 'Aligners, braces and follow-up reviews',
    shift: '09:00 - 15:30',
    roomCode: 'B-104',
  },
  {
    slug: 'periodontology',
    name: 'Dr. Meera Nair',
    department: 'Periodontology',
    specialty: 'Gum therapy and hygiene review',
    shift: '10:00 - 17:00',
    roomCode: 'C-305',
  },
  {
    slug: 'oral-maxillofacial-surgery',
    name: 'Dr. Arvind Rao',
    department: 'Oral and Maxillofacial Surgery',
    specialty: 'Surgical consults and chairside procedures',
    shift: '11:00 - 18:00',
    roomCode: 'OT-2',
  },
  {
    slug: 'pedodontics',
    name: 'Dr. Nisha Joseph',
    department: 'Pedodontics',
    specialty: 'Pediatric dentistry and preventive care',
    shift: '09:30 - 16:00',
    roomCode: 'KIDS-3',
  },
  {
    slug: 'prosthodontics',
    name: 'Dr. Sanjay Iyer',
    department: 'Prosthodontics',
    specialty: 'Crown, bridge and denture planning',
    shift: '08:00 - 14:00',
    roomCode: 'D-112',
  },
] as const

function normalizeSlug(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function normalizeEmail(value?: string) {
  return value?.trim().toLowerCase() || undefined
}

async function getRoomMap(ctx: any) {
  const rooms = await ctx.db.query('rooms').collect()
  return new Map(rooms.map((room) => [room._id, room]))
}

async function getDoctorBySlug(ctx: any, slug: string) {
  return await ctx.db
    .query('doctorProfiles')
    .withIndex('by_slug', (query) => query.eq('slug', slug))
    .unique()
}

export async function ensureDefaultHospitalDirectory(ctx: any) {
  const now = Date.now()
  const roomIds = new Map<string, any>()

  for (const room of defaultRooms) {
    const existingRoom = await ctx.db
      .query('rooms')
      .withIndex('by_code', (query: any) => query.eq('code', room.code))
      .unique()

    if (existingRoom) {
      await ctx.db.patch(existingRoom._id, {
        label: room.label,
        floor: room.floor,
        wing: room.wing,
        isActive: true,
        updatedAt: now,
      })
      roomIds.set(room.code, existingRoom._id)
      continue
    }

    const roomId = await ctx.db.insert('rooms', {
      code: room.code,
      label: room.label,
      floor: room.floor,
      wing: room.wing,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    })
    roomIds.set(room.code, roomId)
  }

  for (const doctor of defaultDoctors) {
    const existingDoctor = await getDoctorBySlug(ctx, doctor.slug)
    const roomId = roomIds.get(doctor.roomCode)

    if (existingDoctor) {
      await ctx.db.patch(existingDoctor._id, {
        name: doctor.name,
        department: doctor.department,
        specialty: doctor.specialty,
        shift: doctor.shift,
        roomId,
        isActive: true,
        updatedAt: now,
      })
      continue
    }

    await ctx.db.insert('doctorProfiles', {
      slug: doctor.slug,
      name: doctor.name,
      department: doctor.department,
      specialty: doctor.specialty,
      shift: doctor.shift,
      roomId,
      email: undefined,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    })
  }

  return {
    roomsSeeded: defaultRooms.length,
    doctorsSeeded: defaultDoctors.length,
  }
}

async function enrichDoctor(ctx: any, doctor: any, roomMap?: Map<any, any>) {
  const nextRoomMap = roomMap ?? (await getRoomMap(ctx))
  const room = doctor.roomId ? nextRoomMap.get(doctor.roomId) ?? null : null

  return {
    ...doctor,
    roomCode: room?.code,
    roomLabel: room?.label,
    roomDisplay: room ? `${room.code} · ${room.label}` : undefined,
  }
}

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const doctors = await ctx.db.query('doctorProfiles').collect()
    const roomMap = await getRoomMap(ctx)
    const enriched = await Promise.all(doctors.map((doctor) => enrichDoctor(ctx, doctor, roomMap)))
    return enriched.sort((left, right) => left.name.localeCompare(right.name))
  },
})

export const listForBooking = query({
  args: {},
  handler: async (ctx) => {
    const doctors = await ctx.db
      .query('doctorProfiles')
      .withIndex('by_is_active', (query) => query.eq('isActive', true))
      .collect()

    if (doctors.length === 0) {
      return defaultDoctors.map((doctor) => ({
        _id: `default:${doctor.slug}`,
        slug: doctor.slug,
        name: doctor.name,
        department: doctor.department,
        specialty: doctor.specialty,
        shift: doctor.shift,
        roomId: undefined,
        roomCode: doctor.roomCode,
        roomLabel: defaultRooms.find((room) => room.code === doctor.roomCode)?.label,
        roomDisplay: doctor.roomCode,
        email: undefined,
        isActive: true,
        createdAt: 0,
        updatedAt: 0,
      }))
    }

    const roomMap = await getRoomMap(ctx)
    const enriched = await Promise.all(doctors.map((doctor) => enrichDoctor(ctx, doctor, roomMap)))
    return enriched.sort((left, right) => left.department.localeCompare(right.department))
  },
})

export const viewerDoctorProfile = query({
  args: {},
  handler: async (ctx) => {
    const { authUser, profile } = await getViewerAuthProfile(ctx)
    if (!authUser || !profile || profile.role !== 'doctor' || !profile.doctorProfileId) {
      return null
    }

    const doctor = await ctx.db.get(profile.doctorProfileId)
    if (!doctor) {
      return null
    }

    return await enrichDoctor(ctx, doctor)
  },
})

export const seedHospitalDirectory = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdminProfile(ctx)

    await ensureDefaultHospitalDirectory(ctx)

    const doctors = await ctx.db.query('doctorProfiles').collect()
    const doctorsBySlug = new Map(doctors.map((doctor) => [doctor.slug, doctor]))
    const appointments = await ctx.db.query('appointments').collect()

    for (const appointment of appointments) {
      const doctor = doctorsBySlug.get(appointment.doctorId)
      if (!doctor) {
        continue
      }

      await ctx.db.patch(appointment._id, {
        doctorProfileId: appointment.doctorProfileId ?? doctor._id,
        roomId: appointment.roomId ?? doctor.roomId,
        department: doctor.department,
      })
    }

    return {
      roomsSeeded: defaultRooms.length,
      doctorsSeeded: defaultDoctors.length,
      appointmentsBackfilled: appointments.length,
    }
  },
})

export const createDoctorProfile = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    department: v.string(),
    specialty: v.optional(v.string()),
    shift: v.string(),
    roomId: v.optional(v.id('rooms')),
    email: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdminProfile(ctx)

    const slug = normalizeSlug(args.slug)
    const existing = await getDoctorBySlug(ctx, slug)
    if (existing) {
      throw new Error('A doctor profile with this slug already exists.')
    }

    const now = Date.now()
    const id = await ctx.db.insert('doctorProfiles', {
      slug,
      name: args.name.trim(),
      department: args.department.trim(),
      specialty: args.specialty?.trim() || undefined,
      shift: args.shift.trim(),
      roomId: args.roomId,
      email: normalizeEmail(args.email),
      isActive: args.isActive,
      createdAt: now,
      updatedAt: now,
    })

    const doctor = await ctx.db.get(id)
    return doctor ? await enrichDoctor(ctx, doctor) : null
  },
})

export const updateDoctorProfile = mutation({
  args: {
    doctorProfileId: v.id('doctorProfiles'),
    slug: v.string(),
    name: v.string(),
    department: v.string(),
    specialty: v.optional(v.string()),
    shift: v.string(),
    roomId: v.optional(v.id('rooms')),
    email: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdminProfile(ctx)

    const doctor = await ctx.db.get(args.doctorProfileId)
    if (!doctor) {
      throw new Error('Doctor profile not found.')
    }

    const slug = normalizeSlug(args.slug)
    const existing = await getDoctorBySlug(ctx, slug)
    if (existing && existing._id !== args.doctorProfileId) {
      throw new Error('A doctor profile with this slug already exists.')
    }

    await ctx.db.patch(args.doctorProfileId, {
      slug,
      name: args.name.trim(),
      department: args.department.trim(),
      specialty: args.specialty?.trim() || undefined,
      shift: args.shift.trim(),
      roomId: args.roomId,
      email: normalizeEmail(args.email),
      isActive: args.isActive,
      updatedAt: Date.now(),
    })

    const updated = await ctx.db.get(args.doctorProfileId)
    return updated ? await enrichDoctor(ctx, updated) : null
  },
})

export const deleteDoctorProfile = mutation({
  args: {
    doctorProfileId: v.id('doctorProfiles'),
  },
  handler: async (ctx, args) => {
    await requireAdminProfile(ctx)

    const doctor = await ctx.db.get(args.doctorProfileId)
    if (!doctor) {
      throw new Error('Doctor profile not found.')
    }

    const assignedUser = await ctx.db
      .query('users')
      .withIndex('by_doctor_profile_id', (query) => query.eq('doctorProfileId', args.doctorProfileId))
      .take(1)

    if (assignedUser.length > 0) {
      throw new Error('This doctor profile is still assigned to a user account.')
    }

    const linkedAppointment = await ctx.db
      .query('appointments')
      .withIndex('by_doctor_profile_id', (query) => query.eq('doctorProfileId', args.doctorProfileId))
      .take(1)

    if (linkedAppointment.length > 0) {
      throw new Error('This doctor profile is still referenced by appointments.')
    }

    await ctx.db.delete(args.doctorProfileId)
    return { success: true as const }
  },
})
