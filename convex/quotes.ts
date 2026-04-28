import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    description: v.string(),
    heavyObjects: v.boolean(),
    stairs: v.boolean(),
    smallSpaces: v.boolean(),
    other: v.boolean(),
    imageIds: v.array(v.id("_storage")),
    location: v.string(),
  },
  returns: v.id("quotes"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("quotes", {
      ...args,
      status: "pending",
      customerAccepted: false,
    });
  },
});

export const get = query({
  args: { id: v.id("quotes") },
  returns: v.any(),
  handler: async (ctx, args) => {
    const quote = await ctx.db.get("quotes", args.id);
    if (!quote) return null;

    // Get image URLs
    const imageUrls = [];
    if (quote.imageIds) {
      for (const id of quote.imageIds) {
        try {
          const url = await ctx.storage.getUrl(id);
          if (url) imageUrls.push(url);
        } catch (e) {
          console.error(`Failed to get URL for storage ID ${id}`);
        }
      }
    }

    return { ...quote, imageUrls };
  },
});

export const customerAction = mutation({
  args: { 
    id: v.id("quotes"), 
    action: v.union(v.literal("accept"), v.literal("requestChange"), v.literal("cancel")),
    message: v.optional(v.string())
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const quote = await ctx.db.get("quotes", args.id);
    if (!quote) throw new Error("Quote not found");

    if (args.action === "accept") {
      await ctx.db.patch("quotes", args.id, { 
        customerAccepted: true,
        status: "booked"
      });
    } else if (args.action === "cancel") {
      await ctx.db.patch("quotes", args.id, { 
        status: "cancelled",
        customerNotes: args.message || "Customer cancelled request"
      });
    } else {
      await ctx.db.patch("quotes", args.id, { 
        status: "change_requested",
        customerNotes: args.message 
      });
    }
    return null;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
