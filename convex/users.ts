import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { authComponent } from './auth'
import { getViewerAuthProfile, requireAdminProfile } from './portalAuth'

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, '').trim();
}

function normalizeName(value?: string) {
  return value?.trim();
}

type PortalRole = 'patient' | 'student' | 'doctor' | 'frontDesk' | 'admin'

async function findDoctorProfileIdByEmail(ctx: any, email?: string) {
  if (!email) {
    return undefined
  }

  const doctor = await ctx.db
    .query('doctorProfiles')
    .withIndex('by_email', (query: any) => query.eq('email', normalizeEmail(email)))
    .first()

  if (!doctor || !doctor.isActive) {
    return undefined
  }

  return doctor._id
}

async function resolveDoctorProfileId(
  ctx: any,
  role: PortalRole,
  options: {
    email?: string
    currentDoctorProfileId?: any
  }
) {
  if (role !== 'doctor') {
    return undefined
  }

  if (options.currentDoctorProfileId) {
    const existingDoctor = await ctx.db.get(options.currentDoctorProfileId)
    if (existingDoctor?.isActive) {
      return existingDoctor._id
    }
  }

  return await findDoctorProfileIdByEmail(ctx, options.email)
}

async function findProfileByAuthUserId(ctx: any, authUserId: string) {
  const [profile] = await ctx.db
    .query('users')
    .withIndex('by_auth_user_id', (query: any) => query.eq('authUserId', authUserId))
    .order('desc')
    .take(1)

  return profile ?? null
}

function resolveRoleFromPortalIntent(intent?: 'patient' | 'doctor', fallbackRole?: PortalRole) {
  if (intent === 'doctor') {
    return 'doctor' as const
  }

  if (intent === 'patient') {
    return 'patient' as const
  }

  return fallbackRole ?? 'patient'
}

export const viewerProfile = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx)
    if (!authUser) {
      return null
    }

    const profile = await findProfileByAuthUserId(ctx, authUser.id)
    const normalizedEmail = authUser.email ? normalizeEmail(authUser.email) : profile?.email
    const normalizedName = normalizeName(authUser.name ?? profile?.name ?? undefined)
    const nextRole = (profile?.role ?? 'patient') as PortalRole
    const nextDoctorProfileId = await resolveDoctorProfileId(ctx, nextRole, {
      email: normalizedEmail,
      currentDoctorProfileId: profile?.doctorProfileId,
    })

    if (profile) {
      return {
        ...profile,
        role: nextRole,
        doctorProfileId: nextDoctorProfileId,
        email: normalizedEmail,
        name: normalizedName,
        image: authUser.image ?? profile.image,
      }
    }

    return {
      _id: `auth:${authUser.id}`,
      authUserId: authUser.id,
      doctorProfileId: undefined,
      name: authUser.name ?? undefined,
      email: authUser.email ?? undefined,
      image: authUser.image ?? undefined,
      role: 'patient',
    }
  },
})

export const ensureViewerProfile = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    portalIntent: v.optional(v.union(v.literal('patient'), v.literal('doctor'))),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx)
    if (!authUser) {
      throw new Error('You must be signed in to sync your profile.')
    }

    const existing = await findProfileByAuthUserId(ctx, authUser.id)
    const normalizedEmail = authUser.email ? normalizeEmail(args.email ?? authUser.email) : undefined
    const nextRole = resolveRoleFromPortalIntent(args.portalIntent, (existing?.role ?? 'patient') as PortalRole)
    const nextDoctorProfileId = await resolveDoctorProfileId(ctx, nextRole, {
      email: normalizedEmail,
      currentDoctorProfileId: existing?.doctorProfileId,
    })
    const nextProfile = {
      authUserId: authUser.id,
      doctorProfileId: nextDoctorProfileId,
      name: normalizeName(args.name ?? authUser.name ?? undefined),
      email: normalizedEmail,
      image: args.image ?? authUser.image ?? undefined,
      role: nextRole,
    }

    if (existing) {
      await ctx.db.patch(existing._id, nextProfile)
      return await ctx.db.get(existing._id)
    }

    const insertedId = await ctx.db.insert('users', {
      ...nextProfile,
      phone: undefined,
    })

    return await ctx.db.get(insertedId)
  },
})

export const upsertViewerProfile = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    portalIntent: v.optional(v.union(v.literal('patient'), v.literal('doctor'))),
    role: v.optional(
      v.union(
        v.literal("patient"),
        v.literal("student"),
        v.literal("doctor"),
        v.literal("frontDesk"),
        v.literal("admin"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx)
    if (!authUser) {
      throw new Error('You must be signed in to update your profile.')
    }

    const normalizedEmail = normalizeEmail(args.email)
    const existing = await findProfileByAuthUserId(ctx, authUser.id)
    const normalizedPhone = normalizePhone(args.phone)
    const nextRole = resolveRoleFromPortalIntent(args.portalIntent, (existing?.role ?? 'patient') as PortalRole)
    const nextDoctorProfileId = await resolveDoctorProfileId(ctx, nextRole, {
      email: normalizedEmail,
      currentDoctorProfileId: existing?.doctorProfileId,
    })
    const nextProfile = {
      authUserId: authUser.id,
      doctorProfileId: nextDoctorProfileId,
      name: args.name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      image: authUser.image ?? existing?.image,
      role: nextRole,
    }

    if (existing) {
      await ctx.db.patch(existing._id, nextProfile)
      return await ctx.db.get(existing._id)
    }

    const insertedId = await ctx.db.insert('users', nextProfile)
    return await ctx.db.get(insertedId)
  },
})

export const canBootstrapAdmin = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx)
    if (!authUser) {
      return false
    }

    const existingAdmin = await ctx.db
      .query('users')
      .withIndex('by_role', (query) => query.eq('role', 'admin'))
      .take(1)

    return existingAdmin.length === 0
  },
})

export const claimBootstrapAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const existingAdmin = await ctx.db
      .query('users')
      .withIndex('by_role', (query) => query.eq('role', 'admin'))
      .take(1)

    if (existingAdmin.length > 0) {
      throw new Error('An admin already exists. Use the admin dashboard to manage roles.')
    }

    const { authUser, profile } = await getViewerAuthProfile(ctx)
    if (!authUser) {
      throw new Error('You must be signed in to claim admin access.')
    }

    let profileId = profile?._id

    if (!profileId) {
      profileId = await ctx.db.insert('users', {
        authUserId: authUser.id,
        doctorProfileId: undefined,
        name: normalizeName(authUser.name ?? undefined),
        email: authUser.email ? normalizeEmail(authUser.email) : undefined,
        image: authUser.image ?? undefined,
        role: 'patient',
      })
    }

    const nextPatch = {
      authUserId: authUser.id,
      role: 'admin' as const,
      doctorProfileId: undefined,
      email: authUser.email ? normalizeEmail(authUser.email) : profile?.email,
      image: authUser.image ?? profile?.image,
      name: normalizeName(authUser.name ?? profile?.name ?? undefined),
    }

    await ctx.db.patch(profileId, nextPatch)
    return await ctx.db.get(profileId)
  },
})

export const listProfiles = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminProfile(ctx)

    const profiles = await ctx.db.query('users').collect()
    return profiles.sort((left, right) => {
      const leftKey = `${left.name ?? ''}${left.email ?? ''}${left.phone ?? ''}`.toLowerCase()
      const rightKey = `${right.name ?? ''}${right.email ?? ''}${right.phone ?? ''}`.toLowerCase()
      return leftKey.localeCompare(rightKey)
    })
  },
})

export const assignRole = mutation({
  args: {
    userId: v.id('users'),
    role: v.union(v.literal('patient'), v.literal('doctor'), v.literal('frontDesk'), v.literal('admin')),
    doctorProfileId: v.optional(v.id('doctorProfiles')),
  },
  handler: async (ctx, args) => {
    await requireAdminProfile(ctx)

    if (args.role === 'doctor' && !args.doctorProfileId) {
      throw new Error('Doctor accounts must be mapped to a doctor profile.')
    }

    const user = await ctx.db.get(args.userId)
    if (!user) {
      throw new Error('User profile not found.')
    }

    await ctx.db.patch(args.userId, {
      role: args.role,
      doctorProfileId: args.role === 'doctor' ? args.doctorProfileId : undefined,
    })

    return await ctx.db.get(args.userId)
  },
})
