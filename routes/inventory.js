import express from "express";
import {
  getAllInventory,
  createInventory,
  getItemByLocation,
  getAllItemInventories,
} from "../controllers/inventoryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getItemByTag } from "../controllers/itemController.js";

const router = express.Router();

router.get("/inventory", getAllInventory);
router.get("/inventory/item/:tag", getItemByTag);
router.get("/inventory/location/:location", getItemByLocation);
router.get("/inventory/:id", getAllItemInventories);
// router.post("/inventory", authMiddleware, createInventory);
router.post("/inventory", createInventory);

export default router;