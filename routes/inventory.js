import express from "express";
import {
  getAllInventory,
  createInventory,
  getAllItemInventories,
  finalize,
  createItem,
  itemByLocation,
  deleteItemFromInventory,
} from "../controllers/inventoryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getItemByTag } from "../controllers/itemController.js";

const router = express.Router();

router.get("/inventory", getAllInventory);
router.get("/inventory/item/:tag", getItemByTag);
router.get("/inventory/location/:location", itemByLocation);
router.get("/inventory/:id", getAllItemInventories);
// router.post("/inventory", authMiddleware, createInventory);
router.post("/inventory", createInventory);
router.post("/inventory/finalize", finalize); 
router.post("/inventory/item", createItem);

router.delete("/inventory/item/delete", deleteItemFromInventory);


export default router;