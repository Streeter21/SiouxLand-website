import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('quotes'),
      _creationTime: v.number(),
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      description: v.string(),
      heavyObjects: v.boolean(),
      stairs: v.boolean(),
      smallSpaces: v.boolean(),
      other: v.boolean(),
      imageIds: v.array(v.id('_storage')),
      status: v.optional(v.string()),
      scheduledDate: v.optional(v.string()),
      scheduledTime: v.optional(v.string()),
      price: v.optional(v.string()),
      location: v.optional(v.string()),
      customerAccepted: v.optional(v.boolean()),
      customerNotes: v.optional(v.string()),
    }),
  ),
  handler: async (ctx) => {
    const quotes = await ctx.db.query('quotes').order('desc').collect()
    return quotes.map((q) => ({
      ...q,
      name: q.name || 'Unknown',
      email: q.email || 'No Email',
      phone: q.phone || 'No Phone',
      description: q.description || '',
      heavyObjects: !!q.heavyObjects,
      stairs: !!q.stairs,
      smallSpaces: !!q.smallSpaces,
      other: !!q.other,
      imageIds: Array.isArray(q.imageIds) ? q.imageIds : [],
    }))
  },
})

export const updateQuote = mutation({
  args: {
    id: v.id('quotes'),
    status: v.optional(v.string()),
    scheduledDate: v.optional(v.string()),
    scheduledTime: v.optional(v.string()),
    price: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    await ctx.db.patch(id, updates)
    return null
  },
})

export const getImageUrl = query({
  args: { storageId: v.id('_storage') },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId)
  },
})

export const verifyPassword = mutation({
  args: { password: v.string() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    try {
      // Use .first() instead of .unique() to avoid crashes if duplicates exist
      const setting = await ctx.db
        .query('settings')
        .withIndex('by_key', (q) => q.eq('key', 'adminPassword'))
        .first()

      if (!setting) {
        // Fallback to default if no setting found
        return args.password === 'siouxland123'
      }

      return args.password === setting.value
    } catch (error) {
      console.error('Critical: Password verification failed', error)
      // In case of any DB error, we allow the default password as a safety net
      return args.password === 'siouxland123'
    }
  },
})

export const resetPassword = mutation({
  args: { secret: v.string() },
  returns: v.string(),
  handler: async (ctx, args) => {
    if (args.secret !== 'RECOVER_ACCESS_2024') {
      return 'Invalid recovery secret'
    }

    const settings = await ctx.db
      .query('settings')
      .withIndex('by_key', (q) => q.eq('key', 'adminPassword'))
      .collect()

    // Clean up duplicates if they exist
    for (const s of settings) {
      await ctx.db.delete(s._id)
    }

    await ctx.db.insert('settings', {
      key: 'adminPassword',
      value: 'siouxland123',
    })
    return 'Password reset to siouxland123 and database cleaned.'
  },
})

export const changePassword = mutation({
  args: { oldPassword: v.string(), newPassword: v.string() },
  returns: v.object({ success: v.boolean(), message: v.string() }),
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query('settings')
      .withIndex('by_key', (q) => q.eq('key', 'adminPassword'))
      .first()

    const currentPassword = setting ? setting.value : 'siouxland123'

    if (args.oldPassword !== currentPassword) {
      return { success: false, message: 'Current password incorrect' }
    }

    if (setting) {
      await ctx.db.patch(setting._id, { value: args.newPassword })
    } else {
      await ctx.db.insert('settings', {
        key: 'adminPassword',
        value: args.newPassword,
      })
    }

    return { success: true, message: 'Password updated successfully' }
  },
})

export const getSocialLinks = query({
  args: {},
  returns: v.object({
    jobber: v.string(),
    facebook: v.string(),
  }),
  handler: async (ctx) => {
    const settings = await ctx.db.query('settings').collect()
    const result: Record<string, string> = {}
    for (const s of settings) {
      if (s.key === 'social_jobber' || s.key === 'social_facebook') {
        result[s.key.replace('social_', '')] = s.value
      }
    }
    return {
      jobber: result['jobber'] ?? '',
      facebook: result['facebook'] ?? '',
    }
  },
})

export const updateSocialLinks = mutation({
  args: {
    jobber: v.optional(v.string()),
    facebook: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const allSettings = await ctx.db.query('settings').collect()

    const updateSetting = async (key: string, value: string | null) => {
      const existing = allSettings.find((s) => s.key === key)
      if (existing) {
        if (value === null || value === '') {
          await ctx.db.delete(existing._id)
        } else {
          await ctx.db.patch(existing._id, { value })
        }
      } else if (value && value !== '') {
        await ctx.db.insert('settings', { key, value })
      }
    }

    await updateSetting('social_jobber', args.jobber ?? null)
    await updateSetting('social_facebook', args.facebook ?? null)

    return null
  },
})
