import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    streetAddress: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    zip: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
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
    invoiceNumber: {
      type: String,
      default: "",
    },
    deliveryCompany: {
      type: String,
      default: "",
    },
    shippingDate: {
      type: Date,
    },
    salesChannel: {
      type: String,
      default: "Website",
    },
    orderType: {
      type: String,
      default: "New",
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
    orderNumber: {
      type: Number,
      unique: true,
      sparse: true,
    },
    archived: {
      type: Boolean,
      default: false,
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
        sku: {
          type: String,
          default: "",
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
