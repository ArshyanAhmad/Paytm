import { Router } from "express";
import { isAuthenticated } from "../middleware/user.auth.js";
import {
   accountBalance,
   transferMoney,
} from "../controllers/account.controller.js";

const router = Router();

router.post("/transfer", isAuthenticated, transferMoney);
router.get("/balance", isAuthenticated, accountBalance);

export default router;
