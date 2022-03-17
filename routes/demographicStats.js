import express from 'express'
const router = express.Router()
import {
  demographicRegions,
  educationalAttainment,
  population,
  populationByRace,
  Test,
} from '../controllers/demographicStats.js'

router.route('/test').get(Test)
router.route('/population').post(population)
router.route('/educational_attainment').post(educationalAttainment)
router.route('/population_by_race').post(populationByRace)
router.route('/regions').get(demographicRegions)

export default router
