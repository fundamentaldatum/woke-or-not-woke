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
    year: v.string(),
    runtime: v.string(),
    wikipediaEntry: v.string(),
  }),
  mormonFilms: defineTable({
    title: v.string(),
    year: v.string(),
    mpaaRating: v.string(),
    runtime: v.string(),
    wikipediaEntry: v.string(),
  }),
  mormonTVShows: defineTable({
    title: v.string(),
    network: v.string(),
    initialYearAired: v.string(),
    genre: v.string(),
    linkToWikipediaEntry: v.string(),
  }),
  mormonFiction: defineTable({
    title: v.string(),
    author: v.string(),
    yearReleased: v.string(),
    howManyPages: v.string(),
    linkToWikipediaEntry: v.string(),
  }),
  mormonNonFiction: defineTable({
    title: v.string(),
    author: v.string(),
    yearReleased: v.string(),
    howManyPages: v.string(),
    linkToWikipediaEntry: v.string(),
  }),
  mormonPodcasts: defineTable({
    title: v.string(),
    podcastNetwork: v.string(),
    yearInitiallyReleased: v.string(),
    genre: v.string(),
    linkToPodcast: v.string(),
  }),
  mormonArchitecture: defineTable({
    title: v.string(),
    architect: v.string(),
    yearCompleted: v.string(),
    howMuchDidItCostToBuild: v.string(),
    linkToWikipediaEntry: v.string(),
  }),
  mormonVisualArt: defineTable({
    title: v.string(),
    artist: v.string(),
    yearCompleted: v.string(),
    genre: v.string(),
    linkToWikipediaEntry: v.string(),
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
