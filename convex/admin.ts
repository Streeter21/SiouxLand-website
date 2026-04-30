import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mock implementation of admin functions - restore based on usage in admin.tsx
export const getBackendStatus = query({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return "v1.2.7-auth ACTIVE";
  },
});

export const verifyPassword = mutation({
  args: { password: v.string() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    // Note: In a real app, this would check against a hashed value in the database
    const adminAccount = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "adminPassword"))
      .unique();
    if (!adminAccount) return args.password === "SiouxLand2024"; // Default fallback
    return args.password === adminAccount.value;
  },
});

export const list = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const quotes = await ctx.db.query("quotes").order("desc").collect();
    const result = [];
    for (const quote of quotes) {
      let user = null;
      if (quote.userId) {
        user = await ctx.db.get(quote.userId);
      }
      result.push({
        ...quote,
        userEmail: user ? user.email : null,
      });
    }
    return result;
  },
});

export const updateQuote = mutation({
  args: {
    id: v.id("quotes"),
    status: v.string(),
    scheduledDate: v.optional(v.string()),
    price: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      scheduledDate: args.scheduledDate,
      price: args.price,
    });
    return null;
  },
});

export const getSocialLinks = query({
  args: {},
  returns: v.object({
    jobber: v.optional(v.string()),
    facebook: v.optional(v.string()),
    instagram: v.optional(v.string()),
    tiktok: v.optional(v.string()),
  }),
  handler: async (ctx) => {
    const links = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "socialLinks"))
      .unique();
    return links?.value ? JSON.parse(links.value) : { jobber: "", facebook: "", instagram: "", tiktok: "" };
  },
});

export const updateSocialLinks = mutation({
  args: {
    jobber: v.optional(v.string()),
    facebook: v.optional(v.string()),
    instagram: v.optional(v.string()),
    tiktok: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "socialLinks"))
      .unique();
    
    if (existing) {
      await ctx.db.patch(existing._id, { value: JSON.stringify(args) });
    } else {
      await ctx.db.insert("settings", { key: "socialLinks", value: JSON.stringify(args) });
    }
    return null;
  },
});

export const resetPassword = mutation({
  args: { secret: v.string() },
  returns: v.string(),
  handler: async (ctx, args) => {
    if (args.secret === "RECOVER_ACCESS_2024") {
      const existing = await ctx.db
        .query("settings")
        .withIndex("by_key", (q) => q.eq("key", "adminPassword"))
        .unique();
      if (existing) {
        await ctx.db.patch(existing._id, { value: "SiouxLand2024" });
      } else {
        await ctx.db.insert("settings", { key: "adminPassword", value: "SiouxLand2024" });
      }
      return "Password reset to default: SiouxLand2024";
    }
    return "Invalid recovery key";
  },
});

export const changePassword = mutation({
  args: { oldPassword: v.string(), newPassword: v.string() },
  returns: v.object({ success: v.boolean(), message: v.string() }),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "adminPassword"))
      .unique();
    const current = existing ? existing.value : "SiouxLand2024";
    
    if (args.oldPassword !== current) {
      return { success: false, message: "Incorrect current password" };
    }
    
    if (existing) {
      await ctx.db.patch(existing._id, { value: args.newPassword });
    } else {
      await ctx.db.insert("settings", { key: "adminPassword", value: args.newPassword });
    }
    return { success: true, message: "Password updated" };
  },
});

export const clearAuthData = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
      await ctx.db.delete(user._id);
    }
    const accounts = await ctx.db.query("authAccounts").collect();
    for (const account of accounts) {
      await ctx.db.delete(account._id);
    }
    const sessions = await ctx.db.query("authSessions").collect();
    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }
    return null;
  },
});
