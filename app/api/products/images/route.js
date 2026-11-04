import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { productModel } from "@/models/product-models";

export async function GET() {
  try {
    await dbConnect();
    const products = await productModel
      .find({ isActive: true }, { name: 1, image: 1, images: 1 })
      .sort({ createdAt: -1, _id: 1 })
      .lean();

    return NextResponse.json({
      products: products.map((product) => ({
        id: product._id.toString(),
        name: product.name,
        images: [...new Set([product.image, ...(product.images || [])].filter(Boolean))],
      })),
    });
  } catch (error) {
    console.error("Error fetching public product image URLs:", error);
    return NextResponse.json(
      { error: "Failed to fetch product image URLs" },
      { status: 500 }
    );
  }
}
