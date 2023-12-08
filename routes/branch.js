import express from "express";
import { createBranch , deleteBranch, getAll, updateBranch } from "../controllers/branchController.js";

const router = express.Router();

router.get("/branch", getAll);
router.post("/branch", createBranch);
router.put("/branch/:id", updateBranch);
router.delete("/branch/:id", deleteBranch);


export default router;
