import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createComplaint = mutation({
  args: {
    submittedBy: v.string(),
    category: v.union(
      v.literal("maintenance"),
      v.literal("food"),
      v.literal("safety"),
      v.literal("other"),
    ),
    description: v.string(),
    hostelBlock: v.optional(v.string()),
    roomNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const referenceId = `CMP-${now.toString().slice(-8)}`;
    const id = await ctx.db.insert("complaints", {
      ...args,
      referenceId,
      status: "open",
      createdAt: now,
      updatedAt: now,
    });

    return { referenceId, id };
  },
});

export const listBySubmitter = query({
  args: {
    submittedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const submittedBy = args.submittedBy;
    if (submittedBy !== undefined) {
      return await ctx.db
        .query("complaints")
        .withIndex("by_submitted_by", (query) =>
          query.eq("submittedBy", submittedBy),
        )
        .order("desc")
        .take(25);
    }

    return await ctx.db.query("complaints").order("desc").take(25);
  },
});
