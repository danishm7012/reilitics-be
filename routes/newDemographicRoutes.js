import express from 'express'
const router = express.Router()
import {
  demographicRegions,
  educationalAttainment,
  population,
  populationByAge,
  populationByRace,
  renterVsOwner,
  incomeByHouseholdType,
  householdByType,
  Test,
} from '../controllers/newDemographicStats.js'

router.route('/test').get(Test)
router.route('/population').post(population)
router.route('/population_by_age').post(populationByAge)
router.route('/renterVsOwner').post(renterVsOwner)
router.route('/income_by_household_type').post(incomeByHouseholdType)
router.route('/household_by_type').post(householdByType)
router.route('/educational_attainment').post(educationalAttainment)
router.route('/population_by_race').post(populationByRace)
router.route('/regions').get(demographicRegions)

export default router
