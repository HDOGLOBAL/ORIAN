import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    streetAddress: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    sameAddress: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    coupon: {
      type: String,
      default: "",
    },
    orderComment: {
      type: String,
      default: "",
    },

    currentStatus: {
      type: String,
      default: "Ordered",
    },
    agreeTerms: {
      type: Boolean,
      required: true,
    },
    trackingId: {
      type: String,
      unique: true,
      required: true,
    },

    transactionId: {
      type: String,
      required: false,
    },
    vatValid: {
      type: Boolean,
      required: false,
    },
    vatNumber: {
      type: String,
      required: true,
    },

    cartItems: [
      {
        id: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totals: {
      subtotal: {
        type: String,
        required: true,
      },
      discount: {
        type: Number,
        required: true,
      },
      shipping: {
        type: Number,
        required: true,
      },
      tax: {
        type: Number,
        required: true,
      },
      grandTotal: {
        type: Number,
        required: true,
      },

      currency: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const OrderModel =
  mongoose.models.OrderData || mongoose.model("OrderData", orderSchema);
