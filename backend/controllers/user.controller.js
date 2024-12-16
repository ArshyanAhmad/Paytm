import { User } from "../models/user.model.js";
import { z } from "zod";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Account } from "../models/account.models.js";

const registerSchema = z.object({
   username: z.string().email("Invalid email"),
   firstname: z.string(),
   lastname: z.string(),
   password: z.string().min(6, "Password must be atleast 6 character"),
});

export const userRegister = async (req, res, next) => {
   const success = registerSchema.safeParse(req.body);

   if (!success.success) {
      const errorMessage =
         success.error.errors.map((err) => err.message).join(", ") ||
         "Something went wrong";
      return res.json({
         success: false,
         message: errorMessage,
      });
   }

   const { username, firstname, lastname, password } = req.body;

   if (
      [username, firstname, lastname, password].some(
         (field) => field?.trim() === ""
      )
   ) {
      return res.json({
         success: false,
         message: "All fields are required",
      });
   }

   const userExist = await User.findOne({ username });

   if (userExist) {
      return res.json({
         success: false,
         message: "User already exist with their username",
      });
   }

   try {
      const user = await User.create(req.body);

      const userId = user._id;

      await Account.create({
         user: userId,
         balance: 1 + Math.random() * 10000,
      });

      const token = jwt.sign(
         {
            userId: user._id,
         },
         process.env.JWT_TOKEN
      );

      res.header("authorization", `Bearer ${token}`);

      return res.json({
         success: true,
         message: "User registered successfully",
         token,
      });
   } catch (error) {
      console.log(error);

      return res.json({
         success: false,
         message: "Internal server error",
      });
   }
};

const loginSchema = z.object({
   username: z.string().email("Invalid Email"),
   password: z.string().min(6, "Password must be atleast 6 character"),
});

export const userLogin = async (req, res, next) => {
   const success = loginSchema.safeParse(req.body);

   if (!success.success) {
      const errorMessage =
         success.error.errors.map((err) => err.message).join(", ") ||
         "Something went wrong";

      return res.json({
         success: false,
         message: errorMessage,
      });
   }

   const { username, password } = req.body;

   if ([username, password].some((field) => field?.trim() === "")) {
      return res.json({
         success: false,
         message: "All fields are required",
      });
   }

   try {
      const user = await User.findOne({ username });

      if (!user) {
         return res.json({
            success: false,
            message: "User not found! plz signup",
         });
      }

      if (user.password !== password) {
         return res.json({
            success: false,
            message: "Invalid username or password!",
         });
      }

      const token = jwt.sign(
         {
            userId: user._id,
         },
         process.env.JWT_TOKEN
      );

      res.header("authorization", `Bearer ${token}`);

      return res.json({
         success: true,
         message: "User login successfully",
         username: user.username,
      });
   } catch (error) {
      console.log(error);

      return res.json({
         success: false,
         message: "Login failed!",
      });
   }
};

const updateUserSchema = z.object({
   firstname: z.string().optional(),
   lastname: z.string().optional(),
   password: z.string().optional(),
});

export const updateUser = async (req, res, next) => {
   const success = updateUserSchema.safeParse(req.body);

   if (!success.success) {
      const errorMessage =
         success.error.errors.map((err) => err.message).join(", ") ||
         "Invalid credential";

      return res.json({
         success: false,
         message: `Error ${errorMessage}`,
      });
   }

   const { userId } = req;
   const isValid = mongoose.Types.ObjectId.isValid(userId);

   if (!isValid) {
      return res.status(401).json({
         success: false,
         message: "User not found, Access denied.",
      });
   }

   try {
      const user = await User.findById(userId);

      if (!user) {
         return res.json({
            success: false,
            message: "User not authorized, Invalid input ",
         });
      }

      const updatedUser = await User.updateOne({ _id: userId }, req.body);

      if (updatedUser.modifiedCount > 0) {
         return res.json({
            success: true,
            message: "User updated successfully",
         });
      } else {
         return res.json({
            success: true,
            message: "Failed to update the user",
         });
      }
   } catch (error) {
      console.log(error);

      return res.json({
         success: false,
         message: "Something went wrong while updating the user",
      });
   }
};

export const bulk = async (req, res, next) => {
   const filter = req.query.filter || "";

   try {
      const users = await User.find({
         $or: [
            { firstname: { $regex: filter, $options: "i" } }, // Case-insensitive search
            { lastname: { $regex: filter, $options: "i" } },
         ],
      }).select("-password");

      return res.json({
         success: true,
         users,
      });
   } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({
         success: false,
         message: "Something went wrong while fetching users",
      });
   }
};
