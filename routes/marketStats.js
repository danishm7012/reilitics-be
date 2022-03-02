import express from "express";
const router = express.Router();
import { medianListSales, Test } from "../controllers/marketStats.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/test").get(Test);
router.route("/median_list_vs_sale_price").get(medianListSales);
// //update rental growth data
// router.route("/rentaljson").get(getRentalJson);
// //update rental appreciation data
// router.route("/appreciationjson").get(getAppreciationJson);

// router.route("/rentalGrowth").get(protect, getRental);
// router.route("/appreciation").get(getAppreciation);

export default router;
