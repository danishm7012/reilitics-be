import express from 'express'
const router = express.Router()
import {
  Test,
  createResource,
  getRentalJson,
  getRental,
} from '../controllers/statsController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/test').get(Test)
//update rental growth data
router.route('/rentaljson').get(getRentalJson)

router.route('/rentalGrowth').get(protect, getRental)

export default router
