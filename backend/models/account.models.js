import mongoose, { Schema } from "mongoose";

// Account Schema
const accountSchema = new Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
   },
   balance: {
      type: Number,
      required: true,
      default: 0, // Default balance
   },
});

export const Account = mongoose.model("Account", accountSchema);
