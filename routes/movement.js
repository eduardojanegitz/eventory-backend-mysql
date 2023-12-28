import express from "express";
import { createMovement, getAll } from "../controllers/movementController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getItemByTag } from "../controllers/itemController.js";

const router = express.Router();

router.post("/movement", authMiddleware, createMovement);
// router.post("/movement", createMovement);
router.get("/movement", getAll);
router.get("/movement/item/:tag", getItemByTag);

export default router;
