import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  quotes: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    description: v.string(),
    heavyObjects: v.boolean(),
    stairs: v.boolean(),
    smallSpaces: v.boolean(),
    other: v.boolean(),
    imageIds: v.array(v.id("_storage")),
  }),
  gallery: defineTable({
    storageId: v.id("_storage"),
    caption: v.optional(v.string()),
  }),
  reviews: defineTable({
    name: v.string(),
    rating: v.number(),
    comment: v.string(),
    approved: v.boolean(),
  }),
});
