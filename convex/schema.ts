import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  photos: defineTable({
    sessionId: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    storageId: v.id("_storage"),
    status: v.string(),
    description: v.optional(v.string()),
    error: v.optional(v.string()),
  }).index("by_session", ["sessionId"]),

  mormonMusic: defineTable({
    title: v.string(),
    artist: v.string(),
    year: v.number(),
    runtime: v.string(),
    wikipediaLink: v.string(),
  }),
  mormonFilms: defineTable({
    title: v.string(),
    year: v.number(),
    mpaaRating: v.string(),
    runtime: v.string(),
    wikipediaLink: v.string(),
  }),
  mormonTVShows: defineTable({
    title: v.string(),
    network: v.string(),
    initialYearAired: v.number(),
    genre: v.string(),
    wikipediaLink: v.string(),
  }),
  mormonFiction: defineTable({
    title: v.string(),
    author: v.string(),
    yearReleased: v.number(),
    pageCount: v.number(),
    wikipediaLink: v.string(),
  }),
  mormonNonFiction: defineTable({
    title: v.string(),
    author: v.string(),
    yearReleased: v.number(),
    pageCount: v.number(),
    wikipediaLink: v.string(),
  }),
  mormonPodcasts: defineTable({
    title: v.string(),
    podcastNetwork: v.string(),
    yearInitiallyReleased: v.number(),
    genre: v.string(),
    podcastLink: v.string(),
  }),
  mormonArchitecture: defineTable({
    title: v.string(),
    architect: v.string(),
    yearCompleted: v.number(),
    constructionCost: v.string(),
    wikipediaLink: v.string(),
  }),
  mormonVisualArt: defineTable({
    title: v.string(),
    artist: v.string(),
    yearCompleted: v.number(),
    genre: v.string(),
    wikipediaLink: v.string(),
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});