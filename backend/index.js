import express from "express";
import { connectDB } from "./db/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// importing user routes
import mainRoutes from "./router/main.routes.js";

// creating api
app.use("/api/v1", mainRoutes);

connectDB()
   .then(() => {
      app.listen(port, () => {
         console.log(`Server connected on port at: ${port}`);
      });
   })
   .catch((err) => {
      console.log(err);
      console.log("Internal server error");
   });
