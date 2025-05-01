import { mutation, query, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

// List all photos for the current user.
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const photos = await ctx.db
      .query("photos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const photoId = await ctx.db.insert("photos", {
      userId,
      storageId: args.storageId,
      status: "pending",
    });
    console.log("[savePhoto] Inserted photo", { photoId, userId, storageId: args.storageId });
    // Schedule the AI description action with a 2-second delay
    await ctx.scheduler.runAfter(2000, internal.photos_actions.describePhoto, { photoId });
    console.log("[savePhoto] Scheduled describePhoto for", photoId, "with internal.photos_actions.describePhoto");
    return photoId;
  },
});

// Get a single photo (with signed URL) - for client, checks user
export const get = query({
  args: { photoId: v.id("photos") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const photo = await ctx.db.get(args.photoId);
    if (!photo || photo.userId !== userId) return null;
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
