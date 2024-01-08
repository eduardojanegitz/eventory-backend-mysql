import express from "express";
import {
  allBranches,
  newBranch,
  inactivateBranchById,
  activateBranchById,
  editBranch,
  activeBranches
} from "../controllers/branchController.js";

const router = express.Router();

router.get("/branch", allBranches);
router.get("/branch/active", activeBranches);
router.post("/branch", newBranch);
router.put("/branch/:id", editBranch);
router.put("/branch/inactive/:id", inactivateBranchById);
router.put("/branch/active/:id", activateBranchById);

export default router;
