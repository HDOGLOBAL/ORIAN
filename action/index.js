"use server";

import { signIn } from "@/auth"; // next-auth's signIn or your custom wrapper
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { dbConnect } from "@/lib/dbConnect";
import { categoryModel } from "@/models/category-models";

// Simple in-memory rate limiter for login attempts (per IP)
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp() {
  try {
    const h = headers();
    const forwarded = h.get("x-forwarded-for");
    return (forwarded ? forwarded.split(",")[0].trim() : h.get("x-real-ip")) || "unknown";
  } catch {
    return "unknown";
  }
}

function checkLoginRateLimit(key) {
  const now = Date.now();
  const record = loginAttempts.get(key);
  if (!record || now - record.firstAttemptAt > WINDOW_MS) {
    loginAttempts.set(key, { count: 1, firstAttemptAt: now });
    return true;
  }
  record.count += 1;
  return record.count <= MAX_ATTEMPTS;
}

export async function login(formData) {
  try {
    const clientIp = getClientIp();
    if (!checkLoginRateLimit(clientIp)) {
      return {
        error: "Too many login attempts. Please try again in 15 minutes.",
      };
    }

    await signIn("credentials", {
      email: formData?.email,
      password: formData?.password,
      redirectTo: "/auth/dashboard",
    });

    // Sign-in succeeded - reset the attempt counter for this IP
    loginAttempts.delete(clientIp);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid email or password",
          };
        default:
          return {
            error: "Something went wrong. Try again later.",
          };
      }
    }
    throw error;
  }
}

export async function updateCategoryFeatured(categoryId, isFeatured) {
  try {
    await dbConnect();

    const updated = await categoryModel.findByIdAndUpdate(
      categoryId,
      { isFeatured },
      { new: true }
    );

    if (!updated) {
      return {
        success: false,
        error: "Category not found",
      };
    }

    return {
      success: true,
      data: {
        id: updated._id.toString(),
        name: updated.name,
        isFeatured: updated.isFeatured,
      },
    };
  } catch (error) {
    console.error("Error updating category:", error);
    return {
      success: false,
      error: error.message,
    };  }
}