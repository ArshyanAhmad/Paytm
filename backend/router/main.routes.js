import { Router } from "express";
import userRoutes from "./user.routes.js";
import accountRoutes from "./accout.routes.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/account", accountRoutes);

export default router;
