import express from "express"
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import { deleteUser, getUserById, getUsers } from "../Controllers/userController.js";

const router = express.Router();

// User Management Routes 
router.get("/", protect, adminOnly, getUsers);
router.get("/:id", protect, getUserById);

export default router;
