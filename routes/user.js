import express from "express";
import {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getById,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/user", getAllUsers);
router.get("/user/:id", getById)
router.post("/user", createUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

export default router;
