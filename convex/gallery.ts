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
    const images = await ctx.db.query("gallery").order("desc").collect();
    return Promise.all(
      images.map(async (img) => ({
        ...img,
        url: await ctx.storage.getUrl(img.storageId),
      }))
    );
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
    const img = await ctx.db.get(args.id);
    if (img) {
      await ctx.storage.delete(img.storageId);
      await ctx.db.delete(args.id);
    }
    return null;
  },
});
