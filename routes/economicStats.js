import express from "express";
const router = express.Router();
import {
  economicRegions,
  employmentIndustry,
  Test,
  unemploymentRate,
} from "../controllers/economicStats.js";

router.route("/test").get(Test);
router.route("/regions").get(economicRegions);
router.route("/unemployment_rate").post(unemploymentRate);
router.route("/industry").post(employmentIndustry);

export default router;
