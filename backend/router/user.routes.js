import { Router } from "express";
import {
   bulk,
   updateUser,
   userLogin,
   userRegister,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/user.auth.js";

const router = Router();

router.post("/signup", userRegister);
router.post("/signin", userLogin);
router.post("/update-user", isAuthenticated, updateUser);
router.get("/bulk", bulk);
// isAuthenticated
// router.post("/changePassword", forotPassword);

export default router;
