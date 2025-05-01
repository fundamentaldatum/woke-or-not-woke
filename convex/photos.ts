import { mutation, query, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

// List all photos for the current session.
export const list = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const photos = await ctx.db
      .query("photos")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .collect();
    // Attach signed URLs for display
    return await Promise.all(
      photos.map(async (photo) => ({
        ...photo,
        url: await ctx.storage.getUrl(photo.storageId),
      }))
    );
  },
});

// Generate a short-lived upload URL for the client
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Save photo metadata after upload, schedule description generation
export const savePhoto = mutation({
  args: {
    storageId: v.id("_storage"),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const photoId = await ctx.db.insert("photos", {
      sessionId: args.sessionId,
      storageId: args.storageId,
      status: "pending",
    });
    console.log("[savePhoto] Inserted photo", { photoId, sessionId: args.sessionId, storageId: args.storageId });
    // Schedule the AI description action with a 2-second delay
    await ctx.scheduler.runAfter(2000, internal.photos_actions.describePhoto, { photoId });
    console.log("[savePhoto] Scheduled describePhoto for", photoId, "with internal.photos_actions.describePhoto");
    return photoId;
  },
});

// Get a single photo (with signed URL) - for client, checks session
export const get = query({
  args: { 
    photoId: v.id("photos"),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const photo = await ctx.db.get(args.photoId);
    // Handle both new photos with sessionId and old photos with userId
    if (!photo) return null;
    
    // For new photos, check sessionId
    if (photo.sessionId && photo.sessionId !== args.sessionId) return null;
    
    // For old photos, allow access (they're already public)
    return {
      ...photo,
      url: await ctx.storage.getUrl(photo.storageId),
    };
  },
});

// Internal get: fetch photo by ID, no user check (for actions)
export const internalGet = internalQuery({
  args: { photoId: v.id("photos") },
  handler: async (ctx, args) => {
    console.log("[internalGet] CALLED with photoId:", args.photoId);
    const photo = await ctx.db.get(args.photoId);
    console.log("[internalGet] photoId:", args.photoId, "photo:", photo);
    return photo;
  },
});

// Set the description after AI completes
export const setDescription = mutation({
  args: {
    photoId: v.id("photos"),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.photoId, {
      description: args.description,
      status: "done",
      error: undefined,
    });
    console.log("[setDescription] Description set for", args.photoId);
  },
});

// Set error if AI fails
export const setError = mutation({
  args: {
    photoId: v.id("photos"),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.photoId, {
      status: "error",
      error: args.error,
    });
    console.error("[setError] Error set for", args.photoId, args.error);
  },
});
