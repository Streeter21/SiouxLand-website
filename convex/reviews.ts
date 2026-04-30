import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { auth } from "./auth";

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
      name: r.name,
      rating: r.rating,
      comment: r.comment,
      approved: r.approved,
    }))
  },
})

export const submit = mutation({
  args: {
    name: v.string(),
    rating: v.number(),
    comment: v.string(),
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    
    try {
      const id = await ctx.db.insert('reviews', {
        ...args,
        ...(userId ? { userId } : {}),
        approved: false, // Default to false so owner can review
      })
      return id
    } catch (error) {
      console.error('Error submitting review:', error)
      throw new Error('Could not save your review. Please try again.')
    }
  },
})

export const approve = mutation({
  args: { id: v.id('reviews') },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { approved: true })
    return null;
  },
})

export const listAll = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    try {
      const reviews = await ctx.db.query('reviews').order('desc').collect()
      const result = [];
      
      for (const r of reviews) {
        let user = null;
        if (r.userId) {
          user = await ctx.db.get(r.userId);
        }
        
        result.push({
          _id: r._id,
          _creationTime: r._creationTime,
          name: r.name || (user ? user.name : 'Anonymous'),
          rating: r.rating || 5,
          comment: r.comment || '',
          approved: !!r.approved,
          userId: r.userId,
          userEmail: user ? user.email : null
        });
      }
      return result;
    } catch (error) {
      console.error('Error listing all reviews:', error)
      return []
    }
  },
})

export const remove = mutation({
  args: { id: v.id('reviews') },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
    return null
  },
})
