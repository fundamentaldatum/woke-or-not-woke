"use node";
import { Buffer } from "buffer";
import { internalAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { v } from "convex/values";

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

export const describePhoto = internalAction({
  args: { photoId: v.id("photos") },
  handler: async (ctx, args) => {
    logEvent("photo_analysis_started", { 
      photoId: args.photoId.toString() 
    });
    
    // Use internal.photos.internalGet, NOT api.photos.get
    const photo = await ctx.runQuery(internal.photos.internalGet, { photoId: args.photoId });
    
    if (!photo) {
      logEvent("photo_analysis_error", {
        photoId: args.photoId.toString(),
        error: "Photo not found",
        stage: "fetch"
      });
      
      await ctx.runMutation(api.photos.setError, {
        photoId: args.photoId,
        error: "Photo not found",
      });
      return;
    }
    
    // Download image from Convex storage
    let imageBuffer: ArrayBuffer;
    try {
      const blob: Blob | null = await ctx.storage.get(photo.storageId);
      if (!blob) throw new Error("Image not found in storage");
      imageBuffer = await blob.arrayBuffer();
      
      logEvent("photo_download_completed", {
        photoId: photo._id.toString(),
        storageId: photo.storageId.toString(),
        size: imageBuffer.byteLength
      });
    } catch (err) {
      logEvent("photo_analysis_error", {
        photoId: args.photoId.toString(),
        error: "Failed to download image",
        stage: "download",
        errorDetails: err instanceof Error ? err.message : String(err)
      });
      
      await ctx.runMutation(api.photos.setError, {
        photoId: args.photoId,
        error: "Failed to download image",
      });
      return;
    }

    // Prepare image as base64 for OpenAI
    const base64Image = Buffer.from(imageBuffer).toString("base64");
    const mimeType = "image/jpeg"; // Default; OpenAI supports jpeg/png/webp/gif
    const dataUri = `data:${mimeType};base64,${base64Image}`;

    // Call OpenAI Vision API
    try {
    // Use your project-specific OpenAI API key from env.
    const OpenAI = require("openai").default;
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = "Describe image'sunique relationship to Mormonism and the Church of Latter-Day Saints. Be concise and to the point. Be very specific and detailed. Every description MUST include specific relationships to Mormonism even if they seem outlandish or farfetched.";
  
  logEvent("openai_request_started", {
    photoId: photo._id.toString(),
        model: "gpt-4.1-nano-2025-04-14",
        maxTokens: 256
      });
      const response = await openai.chat.completions.create({
        model: "gpt-4.1-nano-2025-04-14",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: dataUri } },
            ],
          },
        ],
        max_tokens: 128,
      });

      const description =
        response.choices?.[0]?.message?.content?.trim() ||
        "No description generated.";

      logEvent("openai_request_completed", {
        photoId: photo._id.toString(),
        descriptionLength: description.length,
        responseTime: response.usage?.total_tokens
      });

      await ctx.runMutation(api.photos.setDescription, {
        photoId: args.photoId,
        description,
      });
      
      logEvent("photo_description_saved", {
        photoId: photo._id.toString(),
        status: "done"
      });
    } catch (err: any) {
      logEvent("openai_request_error", {
        photoId: args.photoId.toString(),
        error: err?.message || "Unknown error",
        errorType: err?.name || "Unknown",
        errorCode: err?.code || "none",
        status: err?.status || "unknown"
      });
      
      // More specific error messages based on error type
      let errorMessage = "Failed to generate description with OpenAI.";
      
      if (err.name === "AbortError") {
        errorMessage = "Request timed out. Please try again.";
      } else if (err.status === 429) {
        errorMessage = "Too many requests. Please try again later.";
      } else if (err.code === "insufficient_quota") {
        errorMessage = "API quota exceeded. Please try again later.";
      } else if (err.message) {
        errorMessage = err.message.toString();
      }
      
      await ctx.runMutation(api.photos.setError, {
        photoId: args.photoId,
        error: errorMessage
      });
    }
  },
});
