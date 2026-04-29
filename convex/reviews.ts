import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('reviews'),
      _creationTime: v.number(),
      name: v.string(),
      rating: v.number(),
      comment: v.string(),
      approved: v.boolean(),
      userId: v.optional(v.string()),
    }),
  ),
  handler: async (ctx) => {
    const reviews = await ctx.db
      .query('reviews')
      .withIndex('by_approved', (q) => q.eq('approved', true))
      .order('desc')
      .collect()

    return reviews.map((r) => ({
      _id: r._id,
      _creationTime: r._creationTime,
      name: r.name || 'Anonymous',
      rating: r.rating || 5,
      comment: r.comment || '',
      approved: r.approved ?? true,
      userId: r.userId,
    }))
  },
})

export const submit = mutation({
  args: {
    userId: v.optional(v.string()),
    name: v.string(),
    rating: v.number(),
    comment: v.string(),
  },
  returns: v.id('reviews'),
  handler: async (ctx, args) => {
    return await ctx.db.insert('reviews', {
      ...args,
      approved: false,
    })
  },
})

export const approve = mutation({
  args: { id: v.id('reviews') },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch('reviews', args.id, { approved: true })
    return null
  },
})

export const listAll = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('reviews'),
      _creationTime: v.number(),
      name: v.string(),
      rating: v.number(),
      comment: v.string(),
      approved: v.boolean(),
      userId: v.optional(v.string()),
    }),
  ),
  handler: async (ctx) => {
    const reviews = await ctx.db.query('reviews').order('desc').collect()
    return reviews.map((r) => ({
      _id: r._id,
      _creationTime: r._creationTime,
      name: r.name || 'Anonymous',
      rating: r.rating || 5,
      comment: r.comment || '',
      approved: r.approved ?? false,
      userId: r.userId,
    }))
  },
})

export const remove = mutation({
  args: { id: v.id('reviews') },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete('reviews', args.id)
    return null
  },
})
