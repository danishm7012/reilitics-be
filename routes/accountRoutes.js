import express from 'express'
const router = express.Router()
import {
  createAccount,
  getAccounts,
  getAccountByPeriod,
} from '../controllers/accountController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getAccounts).post(createAccount)
router.route('/byPeriod').post(getAccountByPeriod)

export default router
