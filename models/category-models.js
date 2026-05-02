import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
  CatId: {
    type: Number,
  },
  manufacturerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "manufacturers",
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  icon: {
    type: String, // Optional: URL or icon name (if using an icon set)
  },
  description: {
    type: String,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Slug is unique per manufacturer; same display name may exist for different manufacturers.
categorySchema.index({ manufacturerId: 1, slug: 1 }, { unique: true });

// Delete the model if it exists to force schema refresh
if (mongoose.models.categories) {
  delete mongoose.models.categories;
}

export const categoryModel = mongoose.model("categories", categorySchema);
