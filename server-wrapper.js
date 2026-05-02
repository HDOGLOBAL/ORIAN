// next.config.mjs - Update এর জন্য এই কোড যোগ করুন server initialization এর জন্য

// আপনার বর্তমান next.config.mjs এর মতো দেখতে হবে:
// তবে আমরা একটি custom server hook ব্যবহার করব

/**
 * Since Next.js doesn't provide hooks for custom HTTP server initialization in dev mode,
 * we need to use a different approach. 
 * 
 * Option 1: Use server.js wrapper (সবচেয়ে reliable)
 * Option 2: Use Socket.io adapter that works with Next.js Standalone
 * Option 3: Use middleware + API route approach
 * 
 * For now, we'll stick with server.js but make it cleaner
 */
