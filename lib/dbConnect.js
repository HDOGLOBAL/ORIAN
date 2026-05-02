// lib/dbConnect.js
import mongoose from "mongoose";
import { categoryModel } from "@/models/category-models";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let isConnected = false;

export async function dbConnect() {
  if (isConnected) return;

  const db = await mongoose.connect(MONGODB_URI);
  isConnected = db.connections[0].readyState;
  console.log("MongoDB Connected");

  try {
    await categoryModel.syncIndexes();
  } catch (syncErr) {
    console.warn("Category index sync (categories):", syncErr.message);
  }
}
