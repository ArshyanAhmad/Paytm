import { Account } from "../models/account.models.js";
import { z } from "zod";
import mongoose from "mongoose";

const transferSchema = z.object({
   amount: z.number().positive(),
   to: z.string(),
});

export const transferMoney = async (req, res, next) => {
   const session = await mongoose.startSession();
   session.startTransaction();

   try {
      // Validate request body
      const success = transferSchema.safeParse(req.body);

      if (!success.success) {
         const errorMessage = success.error.errors
            .map((err) => err.message)
            .join(", ");
         await session.abortTransaction();
         return res.status(400).json({
            success: false,
            message: `Validation error: ${errorMessage}`,
         });
      }

      const { amount, to } = success.data;

      // Retrieve sender's account
      const userId = req.userId;
      const account = await Account.findOne({ user: userId }).session(session);

      if (!account || account.balance < amount) {
         await session.abortTransaction();
         return res.status(400).json({
            success: false,
            message: "Insufficient balance",
         });
      }

      // Retrieve recipient's account
      const toAccount = await Account.findOne({ user: to }).session(session);

      if (!toAccount) {
         await session.abortTransaction();
         return res.status(400).json({
            success: false,
            message: "Recipient account not found",
         });
      }

      // Perform balance updates
      await Account.updateOne(
         { user: req.userId },
         { $inc: { balance: -amount } }
      ).session(session);

      await Account.updateOne(
         { user: to },
         { $inc: { balance: amount } }
      ).session(session);

      // Commit the transaction
      await session.commitTransaction();
      res.status(200).json({
         success: true,
         message: "Transfer successful",
      });
   } catch (error) {
      await session.abortTransaction();
      console.error("Transaction failed:", error);
      res.status(500).json({
         success: false,
         message: "Money transfer failed",
      });
   } finally {
      session.endSession();
   }
};

export const accountBalance = async (req, res, next) => {
   const userId = req.userId;

   try {
      const account = await Account.findOne({ user: userId });

      return res.status(200).json({
         balance: account.balance,
      });
   } catch (error) {
      return res.status(400).json({
         success: false,
         message: "Error while fetching the balance",
      });
   }
};
