import express from "express";
const router = express.Router();
import { Test } from "../controllers/demographicStats.js";

router.route("/test").get(Test);
// router.route("/region_names").get(regionNames);

export default router;
