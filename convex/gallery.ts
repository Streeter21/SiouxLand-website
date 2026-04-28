import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("gallery"),
    _creationTime: v.number(),
    storageId: v.id("_storage"),
    url: v.union(v.string(), v.null()),
    caption: v.optional(v.string()),
  })),
  handler: async (ctx) => {
    const images = await ctx.db.query("gallery").order("desc").take(20);
    const results = [];
    for (const img of images) {
      try {
        const url = await ctx.storage.getUrl(img.storageId);
        results.push({
          ...img,
          url,
        });
      } catch (error) {
        console.error(`Failed to get URL for image ${img._id}:`, error);
        // Skip images that fail to resolve or return with null URL
        results.push({
          ...img,
          url: null,
        });
      }
    }
    return results;
  },
});

export const add = mutation({
  args: {
    storageId: v.id("_storage"),
    caption: v.optional(v.string()),
  },
  returns: v.id("gallery"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("gallery", args);
  },
});

export const remove = mutation({
  args: { id: v.id("gallery") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const img = await ctx.db.get("gallery", args.id);
    if (img) {
      await ctx.storage.delete(img.storageId);
      await ctx.db.delete("gallery", args.id);
    }
    return null;
  },
});
