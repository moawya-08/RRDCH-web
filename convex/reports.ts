import { query } from './_generated/server'
import { authComponent } from './auth'

export const listForViewer = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx)
    if (!authUser) {
      return []
    }

    const [profile] = await ctx.db
      .query('users')
      .withIndex('by_auth_user_id', (query: any) => query.eq('authUserId', authUser.id))
      .order('desc')
      .take(1)

    if (!profile) {
      return []
    }

    return await ctx.db
      .query('reports')
      .withIndex('by_patient_id', (query) => query.eq('patientId', profile._id))
      .order('desc')
      .take(12)
  },
})
