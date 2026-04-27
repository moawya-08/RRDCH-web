import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const audience = v.union(
  v.literal("patients"),
  v.literal("students"),
  v.literal("all"),
);

export const listActive = query({
  args: {
    targetAudience: v.optional(audience),
  },
  handler: async (ctx, args) => {
    const announcements = await ctx.db
      .query("announcements")
      .withIndex("by_isActive", (query) => query.eq("isActive", true))
      .order("desc")
      .take(20);

    return announcements.filter((announcement) => {
      if (!args.targetAudience) {
        return true;
      }

      return (
        announcement.targetAudience === "all" ||
        announcement.targetAudience === args.targetAudience
      );
    });
  },
});

export const publish = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    targetAudience: audience,
    publishedBy: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("announcements", {
      ...args,
      isActive: true,
      publishedAt: Date.now(),
    });

    return { id };
  },
});
