import mongoose, { Schema } from "mongoose";

const manufacturerSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  logo: {
    type: String, // URL to the logo image
  },
  description: {
    type: String,
  },
  website: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const manufacturerModel =
  mongoose.models.manufacturers ??
  mongoose.model("manufacturers", manufacturerSchema);
