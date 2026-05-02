
import mongoose from "mongoose";
import { userModel } from "./models/users-model.js";
import bcrypt from "bcryptjs";

// MongoDB connection
const MONGO_URL = process.env.MONGO_URL || "mongodb://admin:X9Tp4mQ8Wv7B2Zr6@72.60.88.241:27017/comet-commerce?authSource=admin";

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");

    // Optional: Delete existing users
    console.log("🗑 Cleared existing users");

    // Hash the password
    const hashedPassword = await bcrypt.hash("112345", 10);

    // Users to seed
    const users = [
      {
        name: "Admin User",
        email: "hdoglobaltrade@gmail.com",
        password: hashedPassword, // Hashed password
        isAdmin: true,
      }
    ];

    // Insert users
    const createdUsers = await userModel.insertMany(users);
    console.log(`✅ Seeded ${createdUsers.length} users`);
    
    // Close connection
    await mongoose.connection.close();
    console.log("🔒 MongoDB connection closed");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  }
}

// Run the seed function
seedUsers();
