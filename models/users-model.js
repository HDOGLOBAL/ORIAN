import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    required: true,
    type: String,
    validate: {
      validator: function (value) {
        return this.googleId || (value && value.length > 0);
      },
      message: "Path `password` is required.",
    },
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },
});

export const userModel =
  mongoose.models.users ?? mongoose.model("users", userSchema);
