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
         minLength: 4,
      },
      lastname: {
         type: String,
         required: true,
         lowercase: true,
         minLength: 4,
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
