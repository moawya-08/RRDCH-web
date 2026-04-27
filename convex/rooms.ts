import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { requireAdminProfile } from './portalAuth'

function normalizeCode(value: string) {
  return value.trim().toUpperCase()
}

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const rooms = await ctx.db.query('rooms').collect()
    return rooms.sort((left, right) => left.code.localeCompare(right.code))
  },
})

export const createRoom = mutation({
  args: {
    code: v.string(),
    label: v.string(),
    floor: v.optional(v.string()),
    wing: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminProfile(ctx)

    const code = normalizeCode(args.code)
    const existing = await ctx.db
      .query('rooms')
      .withIndex('by_code', (query) => query.eq('code', code))
      .unique()

    if (existing) {
      throw new Error('A room with this code already exists.')
    }

    const now = Date.now()
    const id = await ctx.db.insert('rooms', {
      code,
      label: args.label.trim(),
      floor: args.floor?.trim() || undefined,
      wing: args.wing?.trim() || undefined,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    })

    return await ctx.db.get(id)
  },
})

export const updateRoom = mutation({
  args: {
    roomId: v.id('rooms'),
    code: v.string(),
    label: v.string(),
    floor: v.optional(v.string()),
    wing: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdminProfile(ctx)

    const room = await ctx.db.get(args.roomId)
    if (!room) {
      throw new Error('Room not found.')
    }

    const code = normalizeCode(args.code)
    const existing = await ctx.db
      .query('rooms')
      .withIndex('by_code', (query) => query.eq('code', code))
      .unique()

    if (existing && existing._id !== args.roomId) {
      throw new Error('A room with this code already exists.')
    }

    await ctx.db.patch(args.roomId, {
      code,
      label: args.label.trim(),
      floor: args.floor?.trim() || undefined,
      wing: args.wing?.trim() || undefined,
      isActive: args.isActive,
      updatedAt: Date.now(),
    })

    return await ctx.db.get(args.roomId)
  },
})

export const deleteRoom = mutation({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    await requireAdminProfile(ctx)

    const room = await ctx.db.get(args.roomId)
    if (!room) {
      throw new Error('Room not found.')
    }

    const linkedDoctor = await ctx.db
      .query('doctorProfiles')
      .withIndex('by_room_id', (query) => query.eq('roomId', args.roomId))
      .take(1)

    if (linkedDoctor.length > 0) {
      throw new Error('This room is still assigned to a doctor profile.')
    }

    const linkedAppointment = await ctx.db
      .query('appointments')
      .withIndex('by_room_id', (query) => query.eq('roomId', args.roomId))
      .take(1)

    if (linkedAppointment.length > 0) {
      throw new Error('This room is still referenced by appointments.')
    }

    await ctx.db.delete(args.roomId)
    return { success: true as const }
  },
})
