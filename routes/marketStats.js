import express from "express";
const router = express.Router();
import {
  Inventry,
  medianDaysToPending,
  medianListSales,
  Test,
} from "../controllers/marketStats.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/test").get(Test);
router.route("/median_list_vs_sale_price").get(medianListSales);
router.route("/inventry").get(Inventry);
router.route("/median_days_to_pending").get(medianDaysToPending);
// //update rental growth data
// router.route("/rentaljson").get(getRentalJson);
// //update rental appreciation data
// router.route("/appreciationjson").get(getAppreciationJson);

// router.route("/rentalGrowth").get(protect, getRental);
// router.route("/appreciation").get(getAppreciation);

export default router;
