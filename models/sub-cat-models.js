import mongoose, { Schema } from "mongoose";

const subcategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const subcategoryModel =
  mongoose.models.subcategories ??
  mongoose.model("subcategories", subcategorySchema);
