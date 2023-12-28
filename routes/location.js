import express from "express";
import { createLocation, getAll, updateLocation } from "../controllers/locationController.js";

const router = express.Router();

router.get("/location", getAll);
router.post("/location", createLocation);
router.put("/location/:id", updateLocation);

export default router;
