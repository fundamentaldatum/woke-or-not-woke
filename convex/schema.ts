import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  photos: defineTable({
    sessionId: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    storageId: v.id("_storage"),
    status: v.string(), // "pending" | "done" | "error"
    description: v.optional(v.string()),
    error: v.optional(v.string()),
  }).index("by_session", ["sessionId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
