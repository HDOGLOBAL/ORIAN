const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    user1_id: { type: String, required: true },
    user2_id: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);
