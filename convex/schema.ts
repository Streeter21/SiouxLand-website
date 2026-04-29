import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  quotes: defineTable({
    userId: v.optional(v.string()),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    description: v.string(),
    heavyObjects: v.boolean(),
    stairs: v.boolean(),
    smallSpaces: v.boolean(),
    other: v.boolean(),
    imageIds: v.array(v.id("_storage")),
    location: v.optional(v.string()),
    status: v.optional(v.string()),
    scheduledDate: v.optional(v.string()),
    scheduledTime: v.optional(v.string()),
    price: v.optional(v.string()),
    customerAccepted: v.optional(v.boolean()),
    customerNotes: v.optional(v.string()),
  }),
  gallery: defineTable({
    storageId: v.id("_storage"),
    caption: v.optional(v.string()),
  }),
  reviews: defineTable({
    userId: v.optional(v.string()),
    name: v.string(),
    rating: v.number(),
    comment: v.string(),
    approved: v.boolean(),
  }).index("by_approved", ["approved"]),
  settings: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),
});
