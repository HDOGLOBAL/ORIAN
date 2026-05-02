"use server";

import { signIn } from "@/auth"; // next-auth's signIn or your custom wrapper
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { dbConnect } from "@/lib/dbConnect";
import { categoryModel } from "@/models/category-models";

export async function login(formData) {
  try {
    await signIn("credentials", {
      email: formData?.email,
      password: formData?.password,
      redirectTo: "/auth/dashboard",
    });
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