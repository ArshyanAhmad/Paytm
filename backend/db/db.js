import mongoose from "mongoose";

export const connectDB = async () => {
   try {
      const connectionInstance = await mongoose.connect(
         process.env.DATABASE_URL
      );
      console.log(
         "Database connected successfully: ",
         connectionInstance.connection.host
      );
   } catch (error) {
      console.log("Database connection failed", error);
      process.exit(1);
   }
};
