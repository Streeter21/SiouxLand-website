import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("reviews"),
    _creationTime: v.number(),
    name: v.string(),
    rating: v.number(),
    comment: v.string(),
    approved: v.boolean(),
  })),
  handler: async (ctx) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_approved", (q) => q.eq("approved", true))
      .order("desc")
      .collect();
  },
});

export const submit = mutation({
  args: {
    name: v.string(),
    rating: v.number(),
    comment: v.string(),
  },
  returns: v.id("reviews"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("reviews", {
      ...args,
      approved: false, // Default to false so owner can review
    });
  },
});

export const approve = mutation({
  args: { id: v.id("reviews") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch("reviews", args.id, { approved: true });
    return null;
  },
});

export const listAll = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("reviews"),
    _creationTime: v.number(),
    name: v.string(),
    rating: v.number(),
    comment: v.string(),
    approved: v.boolean(),
  })),
  handler: async (ctx) => {
    return await ctx.db.query("reviews").order("desc").collect();
  },
});

export const remove = mutation({
  args: { id: v.id("reviews") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete("reviews", args.id);
    return null;
  },
});
