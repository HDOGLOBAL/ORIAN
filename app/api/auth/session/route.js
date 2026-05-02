// app/api/auth/session/route.js
import { auth } from "@/auth";

export async function GET(req) {
  try {
    const session = await auth(); // Node-only code
    return new Response(JSON.stringify({ session }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }
}
