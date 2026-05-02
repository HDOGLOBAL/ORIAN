import { dbConnect } from "@/service/mongo";
import { cartModel } from "@/models/cart-models";
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

    return NextResponse.json(cart, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};
