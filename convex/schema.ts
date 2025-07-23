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

  // Defines tables for your databases
  mormonMusic: defineTable({
    TITLE: v.string(),
    ARTIST: v.string(),
    YEAR: v.string(),
    RUNTIME: v.string(),
    "WIKIPEDIA ENTRY": v.string(),
  }),
  mormonFilms: defineTable({
    TITLE: v.string(),
    YEAR: v.string(),
    "MPAA RATING": v.string(),
    RUNTIME: v.string(),
    "WIKIPEDIA ENTRY": v.string(),
  }),
  mormonTVShows: defineTable({
    TITLE: v.string(),
    NETWORK: v.string(),
    "INITIAL YEAR AIRED": v.string(),
    GENRE: v.string(),
    "LINK TO WIKIPEDIA ENTRY": v.string(),
  }),
  mormonFiction: defineTable({
    TITLE: v.string(),
    AUTHOR: v.string(),
    "YEAR RELEASED": v.string(),
    "HOW MANY PAGES": v.string(),
    "LINK TO WIKIPEDIA ENTRY": v.string(),
  }),
  mormonNonFiction: defineTable({
    TITLE: v.string(),
    AUTHOR: v.string(),
    "YEAR RELEASED": v.string(),
    "HOW MANY PAGES": v.string(),
    "LINK TO WIKIPEDIA ENTRY": v.string(),
  }),
  mormonPodcasts: defineTable({
    TITLE: v.string(),
    "PODCAST NETWORK": v.string(),
    "YEAR INITIALLY RELEASED": v.string(),
    GENRE: v.string(),
    "LINK TO PODCAST": v.string(),
  }),
  mormonArchitecture: defineTable({
    TITLE: v.string(),
    ARCHITECT: v.string(),
    "YEAR COMPLETED": v.string(),
    "HOW MUCH DID IT COST TO BUILD": v.string(),
    "LINK TO WIKIPEDIA ENTRY": v.string(),
  }),
  mormonVisualArt: defineTable({
    TITLE: v.string(),
    ARTIST: v.string(),
    "YEAR COMPLETED": v.string(),
    GENRE: v.string(),
    "LINK TO WIKIPEDIA ENTRY": v.string(),
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
