import { mutation, query, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

/**
 * Helper function for structured logging
 * @param event The event name
 * @param data The event data
 */
function logEvent(event: string, data: Record<string, any>) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event,
    ...data
  }));
}

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
    
    logEvent("photo_upload_completed", { 
      photoId: photoId.toString(), 
      sessionId: args.sessionId, 
      storageId: args.storageId.toString() 
    });
    
    // Schedule the AI description action with a 2-second delay
    await ctx.scheduler.runAfter(2000, internal.photos_actions.describePhoto, { photoId });
    
    logEvent("photo_analysis_scheduled", { 
      photoId: photoId.toString(),
      delay: "2000ms"
    });
    
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
    logEvent("internal_photo_fetch", {
      photoId: args.photoId.toString(),
      operation: "internalGet"
    });
    
    const photo = await ctx.db.get(args.photoId);
    
    logEvent("internal_photo_fetch_result", {
      photoId: args.photoId.toString(),
      found: !!photo,
      status: photo?.status
    });
    
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
    
    logEvent("photo_analysis_completed", {
      photoId: args.photoId.toString(),
      descriptionLength: args.description.length,
      status: "done"
    });
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
    
    logEvent("photo_analysis_error", {
      photoId: args.photoId.toString(),
      error: args.error,
      status: "error"
    });
  },
});
