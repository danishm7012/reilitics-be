import express from "express";
const router = express.Router();
import {
  Test,
  getRentalJson,
  getRental,
  getAppreciationJson,
  getAppreciation,
} from "../controllers/statsController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/test").get(Test);
//update rental growth data
router.route("/rentaljson").get(getRentalJson);
//update rental appreciation data
router.route("/appreciationjson").get(getAppreciationJson);

router.route("/rentalGrowth").get(getRental);
router.route("/appreciation").get(getAppreciation);

export default router;
