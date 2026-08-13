import mongoose from "mongoose";
import { categoryModel } from "@/models/category-models";

let isConnected = false; // global flag

export async function dbConnect() {
  if (isConnected) {

    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    isConnected = true;

    try {
      await categoryModel.syncIndexes();
    } catch (syncErr) {
      console.warn("Category index sync (categories):", syncErr.message);
    }

    return conn.connection;
  } catch (err) {
    console.error(" MongoDB connection error:", err.message);
    throw err;
  }
}
