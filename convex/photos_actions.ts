"use node";
import { Buffer } from "buffer";
import { internalAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { v } from "convex/values";

export const describePhoto = internalAction({
  args: { photoId: v.id("photos") },
  handler: async (ctx, args) => {
    console.log("[describePhoto] START", { photoId: args.photoId });
    // Use internal.photos.internalGet, NOT api.photos.get
    const photo = await ctx.runQuery(internal.photos.internalGet, { photoId: args.photoId });
    console.log("[describePhoto] Fetched photo:", photo);
    if (!photo) {
      console.error("[describePhoto] Photo not found for photoId", args.photoId);
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
      console.log("[describePhoto] Downloaded image from storage for", photo._id);
    } catch (err) {
      console.error("[describePhoto] Failed to download image", err);
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

      const prompt = "Describe this image in a single, clear English sentence.";
      console.log("[describePhoto] Sending image to OpenAI for", photo._id);
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

      console.log("[describePhoto] OpenAI response:", description);

      await ctx.runMutation(api.photos.setDescription, {
        photoId: args.photoId,
        description,
      });
      console.log("[describePhoto] Set description for", photo._id);
    } catch (err: any) {
      console.error("[describePhoto] OpenAI error", err);
      await ctx.runMutation(api.photos.setError, {
        photoId: args.photoId,
        error:
          err?.message?.toString?.() ||
          "Failed to generate description with OpenAI.",
      });
    }
  },
});
