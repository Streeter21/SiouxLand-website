import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("quotes"),
    _creationTime: v.number(),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    description: v.string(),
    heavyObjects: v.boolean(),
    stairs: v.boolean(),
    smallSpaces: v.boolean(),
    other: v.boolean(),
    imageIds: v.array(v.id("_storage")),
    status: v.optional(v.string()),
    scheduledDate: v.optional(v.string()),
    scheduledTime: v.optional(v.string()),
    price: v.optional(v.string()),
  })),
  handler: async (ctx) => {
    return await ctx.db.query("quotes").order("desc").collect();
  },
});

export const updateQuote = mutation({
  args: {
    id: v.id("quotes"),
    status: v.optional(v.string()),
    scheduledDate: v.optional(v.string()),
    scheduledTime: v.optional(v.string()),
    price: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return null;
  },
});

export const getImageUrl = query({
  args: { storageId: v.id("_storage") },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
