import express from "express";
import {
  allItems,
  itemAvarageAge,
  itemsTotalValue,
  itemsTotalValueInYear,
  itemByCostCenter,
  itemByItemGroup,
  percentageLastMonth,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/dashboard/item/total", allItems);
router.get("/dashboard/item/total-value", itemsTotalValue);
router.get("/dashboard/item/percentage-last-month", percentageLastMonth);
router.get("/dashboard/item/total-value-year", itemsTotalValueInYear);
router.get("/dashboard/item/avarege-items", itemAvarageAge);
router.get("/dashboard/item/itemByCostCenter", itemByCostCenter);
router.get("/dashboard/item/itemByItemGroup", itemByItemGroup);

export default router;
