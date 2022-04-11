import express from 'express'
import passport from 'passport'
const router = express.Router()
import {
  authUser,
  registerUser,
  sendCode,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUserbyID,
  verifyCode,
  changePassword,
  changeAccountStatus,
  getAdmins,
  getEditors,
  verifySignup,
  editProfile,
  getUserProfilebyID,
  AddUserByAdmin,
  getUsersbyPeriod,
  deleteBulkUsers,
  freeMembers,
  monthlyMembers,
  yearlyMembers,
  numberOfMembers,
  newMembers,
  cancelMembers,
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'
import { upload } from '../middleware/multer.js'
import generateToken from '../utils/generateToken.js'

router.get('/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: 'successfull',
      user: req.user,
      token: generateToken(req.user._id),
    })
  }
})

router
  .route('/')
  .post(upload.single('image'), registerUser)
  .get(protect, admin, getUsers)
  .put(protect, upload.single('image'), editProfile)
router.route('/admins').get(protect, admin, getAdmins)
router.route('/byPeriod').post(protect, admin, getUsersbyPeriod)
router.route('/deleteBulk').post(protect, admin, deleteBulkUsers)
router
  .route('/add')
  .post(protect, admin, upload.single('image'), AddUserByAdmin)
router.route('/editors').get(protect, admin, getEditors)
router.route('/free').get(freeMembers)
router.route('/monthly').get(monthlyMembers)
router.route('/yearly').get(yearlyMembers)
router.route('/new').get(newMembers)
router.route('/cancel').get(cancelMembers)
router.route('/count').get(numberOfMembers)

router.post('/verifysignup', verifySignup)

router.post('/login', authUser)
router.post('/sendcode', sendCode)
router.post('/verifycode', verifyCode)
router.put('/changepassword', changePassword)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
router.route('/profile/:id').get(getUserProfilebyID)
router.route('/status/:id').put(protect, admin, changeAccountStatus)

// Google auth

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

router.get(
  '/google/callback',

  passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/',
  }),
  (req, res) => {
    res.redirect('http://localhost:3000/Dashboard')
  }
)

router
  .route('/:id')
  .delete(protect, deleteUser)
  .get(protect, getUserById)
  .put(protect, upload.single('image'), updateUserbyID)

// router.get("/login/failed", (req, res) => {
//   if (req.user) {
//     res.status(403).json({
//       success: true,
//       code: 403,
//       message: "faliure",
//     });
//   }
// });

export default router
