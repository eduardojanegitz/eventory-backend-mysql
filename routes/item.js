import express from "express";
import {
  activateItemById,
  createItem,
  getAllItems,
  inactivateItemById,
  updateItem,
  uploadItemImage,
  writeOff,
} from "../controllers/itemController.js";

const router = express.Router();

router.get("/item", getAllItems);
router.post("/item", createItem);
router.put("/item/:id", updateItem);
router.put("/item/active/:id", activateItemById);
router.put("/item/inactive/:id", inactivateItemById);
router.put("/items/write-off/:id", writeOff);

// router.post("/item/:id/image", upload.single("image"), uploadItemImage);

export default router;
