import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    // ADDED: Localized name fields
    namePt: {
      type: String,
      required: false,
      trim: true,
      maxlength: [100, "Portuguese name cannot exceed 100 characters"],
    },
    nameFr: {
      type: String,
      required: false,
      trim: true,
      maxlength: [100, "French name cannot exceed 100 characters"],
    },
    nameEs: {
      type: String,
      required: false,
      trim: true,
      maxlength: [100, "Spanish name cannot exceed 100 characters"],
    },
    nameHe: {
      type: String,
      required: false,
      trim: true,
      maxlength: [100, "Hebrew name cannot exceed 100 characters"],
    },
    nameDe: {
       type: String,
       required: false,
       trim: true,
      maxlength: [100, "German name cannot exceed 100 characters"],
},
    image: {
      type: String,
      required: false,
    },
    price: {
      usd: {
        type: Number,
        required: false,
        min: [0, "Price cannot be negative"],
      },
      eur: {
        type: Number,
        required: false,
        min: [0, "Price cannot be negative"],
      },
      // ✅ GBP price for UK
      gbp: {
        type: Number,
        required: false,
        min: [0, "Price cannot be negative"],
      },
    },
    discountPrice: {
      usd: {
        type: Number,
        required: false,
        min: [0, "Discount price cannot be negative"],
        validate: {
          validator: function (value) {
            return !value || value < this.price.usd;
          },
          message: "Discount price must be lower than regular price",
        },
      },
      eur: {
        type: Number,
        required: false,
        min: [0, "Discount price cannot be negative"],
        validate: {
          validator: function (value) {
            return !value || value < this.price.eur;
          },
          message: "Discount price must be lower than regular price",
        },
      },
      // ✅ GBP discount price for UK
      gbp: {
        type: Number,
        required: false,
        min: [0, "Discount price cannot be negative"],
        validate: {
          validator: function (value) {
            return !value || value < this.price.gbp;
          },
          message: "GBP discount price must be lower than regular price",
        },
      },
    },
    reviewsNumber: {
      type: Number,
      required: false,
      default: 0,
      min: [0, "Reviews number cannot be negative"],
    },
    ratings: {
      type: Number,
      required: false,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
    },
    manufacturerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "manufacturers",
      required: false,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: false,
      index: true,
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subcategories",
      required: false,
      index: true,
    },
    description: {
      required: false,
      type: String,
    },
    // ADDED: Localized description fields
    descriptionPt: {
      type: String,
      required: false,
    },
    descriptionFr: {
      type: String,
      required: false,
    },
    descriptionEs: {
      type: String,
      required: false,
    },
    descriptionHe: {
      type: String,
      required: false,
    },
    descriptionDe: {
  type: String,
  required: false,
},
    discountCodes: [
      {
        code: {
          type: String,
          uppercase: true,
          trim: true,
        },
        value: {
          type: Number,
          min: 0,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    soldCount: {
      type: Number,
      required: false,
      default: 0,
      min: [0, "Sold count cannot be negative"],
    },
    published: {
      type: Date,
      required: false,
      default: Date.now,
      immutable: true,
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    minStock: {
      type: Number,
      min: [0, "Minimun stock cannot be negative"],
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },
    features: {
      type: [String],
      required: false,
      default: [],
    },
    sku: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    shippingEu: {
      type: Number,
      required: false,
      default: 0,
    },
    shippingAsia: {
      type: Number,
      required: false,
      default: 0,
    },
    shippingPt: {
      type: Number,
      required: false,
      default: 0,
    },
    shippingFr: {
      type: Number,
      required: false,
      default: 0,
    },
    shippingSp: {
      type: Number,
      required: false,
      default: 0,
    },
    shippingWorld: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes (updated to include localized fields)
productSchema.index({
  name: "text",
  namePt: "text",
  nameFr: "text",
  nameEs: "text",
  nameHe: "text",
  description: "text",
  descriptionPt: "text",
  descriptionFr: "text",
  descriptionEs: "text",
  descriptionHe: "text",
});

productSchema.index({ "price.usd": 1 });
productSchema.index({ "price.eur": 1 });
productSchema.index({ "price.gbp": 1 }); // ✅ GBP index
productSchema.index({ quantity: 1 });
productSchema.index({ manufacturerId: 1 });
productSchema.index({ categoryId: 1 });
productSchema.index({ subcategoryId: 1 });

// Virtual property
productSchema.virtual("inStock").get(function () {
  return this.quantity > 0;
});

// Virtual for final price calculation
productSchema.virtual("finalPrice").get(function () {
  return {
    usd: this.discountPrice?.usd || this.price.usd,
    eur: this.discountPrice?.eur || this.price.eur,
    gbp: this.discountPrice?.gbp || this.price.gbp, // ✅ GBP
  };
});

// Pre-save validation
productSchema.pre("save", function (next) {
  if (this.discountPrice?.usd && this.discountPrice.usd >= this.price.usd) {
    throw new Error("USD discount price must be lower than regular price");
  }
  if (this.discountPrice?.eur && this.discountPrice.eur >= this.price.eur) {
    throw new Error("EUR discount price must be lower than regular price");
  }
  if (this.discountPrice?.gbp && this.price.gbp && this.discountPrice.gbp >= this.price.gbp) {
    throw new Error("GBP discount price must be lower than regular price");
  }
  next();
});

// Keep the same model name to maintain compatibility
export const productModel =
  mongoose.models.products || mongoose.model("products", productSchema);
