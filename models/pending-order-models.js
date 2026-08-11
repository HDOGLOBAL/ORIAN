import mongoose, { Schema } from "mongoose";

const pendingOrderSchema = new Schema(
  {
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    parts: [
      {
        manufacturer: {
          type: String,
          default: "",
        },
        partsNumber: {
          type: String,
          default: "",
        },
        qty: {
          type: Number,
          default: 1,
        },
      },
    ],
    currentStatus: {
      type: String,
      default: "Ordered",
    },
  },
  {
    timestamps: true,
  }
);

export const PendingOrderModel =
  mongoose.models.PendingOrder ||
  mongoose.model("PendingOrder", pendingOrderSchema);
