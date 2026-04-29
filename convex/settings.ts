import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

// Social link keys that can be stored
const SOCIAL_LINK_KEYS: Array<
  'facebook' | 'instagram' | 'jobber' | 'google' | 'yelp' | 'nextdoor'
> = ['facebook', 'instagram', 'jobber', 'google', 'yelp', 'nextdoor'] as const

export type SocialLinkKey = (typeof SOCIAL_LINK_KEYS)[number]

export const getSocialLinks = query({
  args: {},
  returns: v.record(v.string(), v.string()),
  handler: async (ctx) => {
    const socialLinks: Record<string, string> = {}

    for (const key of SOCIAL_LINK_KEYS) {
      const setting = await ctx.db
        .query('settings')
        .withIndex('by_key', (q) => q.eq('key', key))
        .first()

      if (setting && setting.value) {
        socialLinks[key] = setting.value
      }
    }

    return socialLinks
  },
})

export const updateSocialLinks = mutation({
  args: v.object({
    facebook: v.optional(v.string()),
    instagram: v.optional(v.string()),
    jobber: v.optional(v.string()),
    google: v.optional(v.string()),
    yelp: v.optional(v.string()),
    nextdoor: v.optional(v.string()),
  }),
  returns: v.null(),
  handler: async (ctx, args) => {
    const entries = Object.entries(args) as Array<
      [SocialLinkKey, string | undefined]
    >

    for (const [key, value] of entries) {
      if (value === undefined) continue

      const trimmedValue = value.trim()

      // Find existing setting
      const existing = await ctx.db
        .query('settings')
        .withIndex('by_key', (q) => q.eq('key', key))
        .first()

      if (existing) {
        if (trimmedValue) {
          await ctx.db.patch('settings', existing._id, { value: trimmedValue })
        } else {
          // Remove the setting if value is empty
          await ctx.db.delete('settings', existing._id)
        }
      } else if (trimmedValue) {
        await ctx.db.insert('settings', { key, value: trimmedValue })
      }
    }

    return null
  },
})
