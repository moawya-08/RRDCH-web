import { query } from "./_generated/server";
import { v } from "convex/values";

export const listByDepartment = query({
  args: {
    department: v.optional(v.string()),
    year: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const department = args.department;
    const year = args.year;

    if (department !== undefined && year !== undefined) {
      return await ctx.db
        .query("schedules")
        .withIndex("by_department_and_year", (query) =>
          query.eq("department", department).eq("year", year),
        )
        .order("asc")
        .take(40);
    }

    if (department !== undefined) {
      const schedules = await ctx.db
        .query("schedules")
        .withIndex("by_department_and_dayOfWeek", (query) =>
          query.eq("department", department),
        )
        .order("asc")
        .take(60);

      return year !== undefined
        ? schedules.filter((schedule) => schedule.year === year)
        : schedules;
    }

    const schedules = await ctx.db.query("schedules").order("asc").take(60);
    return year !== undefined
      ? schedules.filter((schedule) => schedule.year === year)
      : schedules;
  },
});
