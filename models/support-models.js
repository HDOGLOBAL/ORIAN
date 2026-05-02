import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    avatar: { type: String, required: true },
    id: { type: String, required: true, unique: true }, // unique key
  },
  { timestamps: true }
);

export default mongoose.models.Support ||
  mongoose.model("Support", supportSchema);
