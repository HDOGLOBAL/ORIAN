import { dbConnect } from "@/service/mongo";
import { cartModel } from "@/models/cart-models";
import { productModel } from "@/models/product-models";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async (request) => {
  await dbConnect();

  const { searchParams } = new URL(request.url);

  const userId = searchParams.get("userId");
  const trackingId = searchParams.get("trackingId");


  try {
    let cart = null;

    // Try to find cart by userId if valid
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      cart = await cartModel.findOne({ userId, isOrdered: false }).lean();
    }

    // If no cart found and trackingId is present, search by trackingId
    if (!cart && trackingId) {
      cart = await cartModel.findOne({ trackingId, isOrdered: false }).lean();
    }

    if (!cart) {
      return NextResponse.json({ error: "Cart not found." }, { status: 404 });
    }

    // Populate price.eur for each cart item so header can calculate total
    if (cart.items && cart.items.length > 0) {
      const productIds = cart.items.map((i) => i.productId);
      const products = await productModel.find(
        { _id: { $in: productIds } },
        { price: 1 }
      ).lean();
      const priceMap = {};
      products.forEach((p) => { priceMap[p._id.toString()] = p.price?.eur || 0; });
      cart.items = cart.items.map((item) => ({
        ...item,
        price: priceMap[item.productId?.toString()] || 0,
      }));
    }

    return NextResponse.json(cart, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};
