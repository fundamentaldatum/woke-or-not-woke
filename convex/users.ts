import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Query to get the current user (for auth check)
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db.get(userId);
  },
});
