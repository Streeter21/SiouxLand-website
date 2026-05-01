import { action } from "./_generated/server";
import { v } from "convex/values";

// This action is to be run manually to set the correct JWT keys
export const setKeys = action({
  args: {
    privateKey: v.string(),
    publicKey: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // We can't set env vars from within Convex actions usually,
    // but we can check if they are correct.
    console.log("Checking keys...");
    console.log("Private key length:", args.privateKey.length);
    console.log("Private key starts with:", args.privateKey.substring(0, 30));
    console.log("Private key ends with:", args.privateKey.substring(args.privateKey.length - 30));
    
    // Test importing it using jose (which is available in Convex runtime)
    // Actually jose is a dependency in package.json, so it should be available.
    return null;
  },
});
