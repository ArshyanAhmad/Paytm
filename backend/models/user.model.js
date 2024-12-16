import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
   {
      username: {
         type: String,
         required: true,
         unique: true,
         trim: true,
      },
      firstname: {
         type: String,
         required: true,
         lowercase: true,
         trim: true,
         minLength: 3,
      },
      lastname: {
         type: String,
         required: true,
         lowercase: true,
      },
      password: {
         type: String,
         required: true,
         minLength: 6,
      },
   },
   {
      timestamps: true,
   }
);

export const User = mongoose.model("User", userSchema);
