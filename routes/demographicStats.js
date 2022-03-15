import express from "express";
const router = express.Router();
import {
  demographicRegions,
  EducationalOrRace,
  population,
  Test,
} from "../controllers/demographicStats.js";

router.route("/test").get(Test);
router.route("/population").post(population);
router.route("/educational_race_json").post(EducationalOrRace);
router.route("/regions").get(demographicRegions);


export default router;
