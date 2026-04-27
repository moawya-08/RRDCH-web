import { authComponent } from './auth'

export async function getViewerAuthProfile(ctx: any) {
  const authUser = await authComponent.safeGetAuthUser(ctx)
  if (!authUser) {
    return { authUser: null, profile: null }
  }

  const [profile] = await ctx.db
    .query('users')
    .withIndex('by_auth_user_id', (query: any) => query.eq('authUserId', authUser.id))
    .order('desc')
    .take(1)

  return { authUser, profile: profile ?? null }
}

export async function requireViewerProfile(ctx: any) {
  const { authUser, profile } = await getViewerAuthProfile(ctx)

  if (!authUser || !profile) {
    throw new Error('You must be signed in to access the hospital portal.')
  }

  return { authUser, profile }
}

export async function requireAdminProfile(ctx: any) {
  const { authUser, profile } = await requireViewerProfile(ctx)

  if (profile.role !== 'admin') {
    throw new Error('Admin access is required for this action.')
  }

  return { authUser, profile }
}

export async function requireFrontDeskOrAdminProfile(ctx: any) {
  const { authUser, profile } = await requireViewerProfile(ctx)

  if (profile.role !== 'frontDesk' && profile.role !== 'admin') {
    throw new Error('Front desk access is required for this action.')
  }

  return { authUser, profile }
}

export async function requireDoctorProfileAssignment(ctx: any) {
  const { authUser, profile } = await requireViewerProfile(ctx)

  if (profile.role !== 'doctor') {
    throw new Error('Doctor access is required for this action.')
  }

  if (!profile.doctorProfileId) {
    throw new Error('No doctor profile is assigned to this account yet.')
  }

  const doctorProfile = await ctx.db.get(profile.doctorProfileId)
  if (!doctorProfile) {
    throw new Error('The assigned doctor profile could not be found.')
  }

  return { authUser, profile, doctorProfile }
}
