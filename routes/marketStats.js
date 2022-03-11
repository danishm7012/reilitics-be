import express from "express";
const router = express.Router();
import {
  Inventry,
  medianDaysToPending,
  medianListSales,
  medianPriceCut,
  medianRental,
  regionNames,
  rentalAppreciation,
  sharePriceCut,
  Test,
} from "../controllers/marketStats.js";

router.route("/test").get(Test);
router.route("/region_names").get(regionNames);
router.route("/rental_appreciation").post(rentalAppreciation);
router.route("/median_list_vs_sale_price").post(medianListSales);
router.route("/inventry").post(Inventry);
router.route("/median_days_to_pending").post(medianDaysToPending);
router.route("/share_price_cut").post(sharePriceCut);
router.route("/median_price_cut").post(medianPriceCut);
router.route("/median_rental").post(medianRental);
// //update rental growth data
// router.route("/rentaljson").get(getRentalJson);
// //update rental appreciation data
// router.route("/appreciationjson").get(getAppreciationJson);

// router.route("/rentalGrowth").get(protect, getRental);
// router.route("/appreciation").get(getAppreciation);

export default router;
