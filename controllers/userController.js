import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'
import Verify from '../models/verify.js'
import moment from 'moment'

import { uploadOnCloud } from '../config/cloudinary.js'

import {
  validateRegisterInput,
  validateLoginInput,
  verifySignupInput,
} from '../validation/userValidation.js'
import { sendEmail } from '../config/sendMail.js'
import { upload } from '../middleware/multer.js'

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { isValid, errors } = await validateLoginInput(req.body)

  if (!isValid) {
    return res.status(403).json({
      success: false,
      code: 403,
      message: errors,
    })
  }
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })

    // if (!user.email_varification) {
    //   res.status(401);
    //   throw new Error("Email is not verified!");
    // }

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        code: 200,
        message: 'Logged in successfully!',
        token: generateToken(user._id),
        user,
      })
    } else {
      res.status(401)
      throw new Error('Invalid email or password')
    }
  } catch (error) {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  let image = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  if (req.file) {
    const result = await uploadOnCloud(req.file.path, 'Images')
    image = result.url
    console.log(image)
  }

  const { isValid, errors } = await validateRegisterInput(req.body)

  if (!isValid) {
    return res.status(403).json({
      success: false,
      code: 403,
      message: errors,
    })
  }
  // let image = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  // if (req.file) {
  //   image = `https://reilitics-be.herokuapp.com/${req.file.path}`;
  // }

  const emailExists = await User.findOne({ email: req.body.email })
  const usernameExists = await User.findOne({ username: req.body.username })

  if (emailExists) {
    res.status(400)
    throw new Error('Email already exists')
  }
  if (usernameExists) {
    res.status(400)
    throw new Error('Username already exists')
  }

  const newUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    image,
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
    phone: req.body.phone,
    country: req.body.country,
    state: req.body.state,
    date_of_birth: req.body.dob,
    packageID: req.body.packageID,
    packageStatus: req.body.packageStatus,
  }

  const user = await User.create(newUser)

  if (!user) {
    res.status(400)
    throw new Error('Invalid user data')
  } else {
    const result = await sendEmail(user)
    res.status(201).json({
      success: true,
      message: 'kindly Check your email for confirmation code',
      token: generateToken(user._id),
      user,
    })
  }
})
// @desc    Add a new user by admin
// @route   POST /api/users/add
// @access  Admin
const AddUserByAdmin = asyncHandler(async (req, res) => {
  let image = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  if (req.file) {
    const result = await uploadOnCloud(req.file.path, 'Images')
    image = result.url
  }

  const { isValid, errors } = await validateRegisterInput(req.body)

  if (!isValid) {
    return res.status(403).json({
      success: false,
      code: 403,
      message: errors,
    })
  }

  const emailExists = await User.findOne({ email: req.body.email })
  const usernameExists = await User.findOne({ username: req.body.username })

  if (emailExists) {
    res.status(400)
    throw new Error('Email already exists')
  }
  if (usernameExists) {
    res.status(400)
    throw new Error('Username already exists')
  }

  const newUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    image,
    packageID: req.body.packageID,
    packageStatus: req.body.packageStatus,
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
    phone: req.body.phone,
    country: req.body.country,
    state: req.body.state,
    date_of_birth: req.body.dob,
    role: req.body.role,
  }

  const user = await User.create(newUser)

  if (!user) {
    res.status(400)
    throw new Error('Invalid user data')
  } else {
    const result = await sendEmail(user)
    res.status(201).json({
      success: true,
      code: 200,
      message: 'User added successfully!',
      user,
    })
  }
})

// @desc   Verify User being signed up
// @route Get /api/users/verifysignup
// @access public
const verifySignup = asyncHandler(async (req, res) => {
  const { isValid, errors } = await verifySignupInput(req.body)

  const emailExists = await User.findOne({ email: req.body.email })
  const usernameExists = await User.findOne({ username: req.body.username })

  if (emailExists) {
    res.status(400)
    throw new Error('Email already exists')
  }
  if (usernameExists) {
    res.status(400)
    throw new Error('Username already exists')
  }

  if (!isValid) {
    return res.status(403).json({
      success: false,
      code: 403,
      message: errors,
    })
  } else {
    return res.status(201).json({
      success: true,
      code: 200,
      message: 'User is verified',
    })
  }
})
// @desc    Resend varification code to the email
// @route   GET /api/users/sendcode
// @access  Private
const sendCode = async (req, res) => {
  console.log(req.body.email)
  User.findOne({
    email: {
      $regex: req.body.email,
      $options: 'i',
    },
  })
    .then(async (user) => {
      await sendEmail(user) // sending code on given email
      res.status(201).json({
        success: true,
        message: 'kindly Check your email for code confirmation!',
      })
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Email doesn't exist!",
      })
    })
}

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')

  if (user) {
    res.json({ success: true, code: 200, user })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})
// @desc    Get user profile by ID
// @route   GET /api/users/profile/:id
// @access  Private
const getUserProfilebyID = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json({ success: true, code: 200, user })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.firstName = req.body.firstName || user.firstName
    user.lastName = req.body.lastName || user.lastName
    user.email = req.body.email || user.email
    user.country = req.body.country || user.country
    user.state = req.body.state || user.state
    user.accountStatus = req.body.accountStatus || user.accountStatus

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      country: updatedUser.country,
      state: updatedUser.state,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile/:id
// @access  Private/Admin
const changeAccountStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.accountStatus = req.body.accountStatus || user.accountStatus

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      success: true,
      code: 200,
      message: `User ${updatedUser.accountStatus} successfully!`,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get user by time period
// @route   POST /api/users/byPeriod
// @access  Private/Admin
const getUsersbyPeriod = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.body
  console.log('ssss ')

  const users = await User.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  })

  res.json({
    success: true,
    code: 200,
    message: `Users from ${moment(startDate).format(
      'MMMM D, YYYY'
    )} to ${moment(endDate).format('MMMM D, YYYY')}.`,
    Data: users,
  })
})
// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        username: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  const count = await User.countDocuments({ ...keyword })
  const users = await User.find({ ...keyword, role: 'user' })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  if (!users) {
    res.status(401)
    throw new Error('Users not found')
  }

  res.json({ succes: true, users, page, pages: Math.ceil(count / pageSize) })
})
// @desc    Get Admins
// @route   GET /api/users/admins
// @access  Private/Admin
const getAdmins = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'admin' })
  if (users) {
    res.json({ success: true, code: 200, admins: users })
  } else {
    res.status(401)
    throw new Error('Users not found')
  }
})
// @desc    Get editors
// @route   GET /api/users/editors
// @access  Private/editor
const getEditors = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'editor' })
  if (users) {
    res.json({ success: true, code: 200, editors: users })
  } else {
    res.status(401)
    throw new Error('Users not found')
  }
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ succes: true, code: 200, message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user by admin
// @route   PUT /api/users
// @access  Private
const updateUserbyID = asyncHandler(async (req, res) => {
  console.log(req.params.id)
  const user = await User.findById(req.params.id)
  console.log(user)
  let image = user.image
  if (req.file) {
    const result = await uploadOnCloud(req.file.path, 'Images')
    image = result.url
    console.log(image)
  }

  if (user) {
    user.firstName = req.body.firstName || user.firstName
    user.lastName = req.body.lastName || user.lastName
    user.image = image
    user.email = req.body.email || user.email
    user.username = req.body.username || user.username
    user.phone = req.body.phone || user.phone
    user.password = req.body.password || user.password
    user.country = req.body.country || user.country
    user.state = req.body.state || user.state
    user.date_of_birth = req.body.date_of_birth || user.date_of_birth
    user.role = req.body.role || user.role
    user.accountStatus = req.body.accountStatus || user.accountStatus
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()

    res.json({
      success: true,
      code: '200',
      data: updatedUser,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})
// @desc    Edit own profile
// @route   PUT /api/users
// @access  Private
const editProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  let image = user.image
  if (req.file) {
    const result = await uploadOnCloud(req.file.path, 'Images')
    image = result.url
    console.log(image)
  }

  if (user) {
    user.firstName = req.body.firstName || user.firstName
    user.lastName = req.body.lastName || user.lastName
    user.image = image
    user.email = req.body.email || user.email
    user.username = req.body.username || user.username
    user.phone = req.body.phone || user.phone
    user.password = req.body.password || user.password
    user.country = req.body.country || user.country
    user.state = req.body.state || user.state
    user.date_of_birth = req.body.date_of_birth || user.date_of_birth
    user.role = req.body.role || user.role
    user.accountStatus = req.body.accountStatus || user.accountStatus
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()

    res.json({
      success: true,
      code: '200',
      data: updatedUser,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})
// @desc    Verify Code
// @route   GET /api/users/verifycode
// @access  Private/Protected
const verifyCode = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    email: {
      $regex: req.body.email,
      $options: 'i',
    },
  })
  const get_user = await Verify.findOne({
    user: user._id,
  })
  if (get_user == null) {
    res.status(400)
    throw new Error('User Does not exist')
  }
  console.log(`save: ${get_user.code} body:${req.body.confirmation_code}`)
  if (get_user.code != req.body.confirmation_code) {
    res.status(401)
    throw new Error('Code does not match!')
  } else {
    user.email_varification = true
    await user.save()
    res.json({
      success: true,
      code: '200',
      message: 'Email Verified successfully!',
    })
  }
})
// @desc    Change password
// @route   GET /api/users/changepassword
// @access  Public
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  const get_user = await Verify.findOne({
    user: user._id,
  })
  if (get_user == null) {
    res.status(400)
    throw new Error('User Does not exist')
  }
  console.log(`save: ${get_user.code} body:${req.body.confirmation_code}`)
  if (get_user.code != req.body.confirmation_code) {
    res.status(401)
    throw new Error('Code does not match!')
  } else {
    user.password = req.body.newPassword || user.password
    await user.save()
    res.json({
      success: true,
      code: '200',
      message: 'Password has been changed successfully!',
    })
  }
})
// @desc    Delete bulk users
// @route   GET /api/users/deleteBulk
// @access  Admin
const deleteBulkUsers = asyncHandler(async (req, res) => {
  const { deleteUsers } = req.body

  User.remove({ _id: { $in: deleteUsers } })
    .then(() => {
      res.json({
        success: true,
        code: '200',
        message: 'Users deleted successfully!',
      })
    })
    .catch((err) => {
      res.status(401)
      throw new Error('Users not deleted!')
    })
})
// @desc    Get free members
// @route   GET /api/users/free
// @access  Admin
const freeMembers = asyncHandler(async (req, res) => {
  const users = await User.find({
    packageID: '62128260efa0835502296bfd',
  }).select('-password')

  if (!users) {
    res.status(401)
    throw new Error('Users not found!')
  } else {
    res.json({
      success: true,
      code: '200',
      message: 'Free users.',
      Data: users,
    })
  }
})
// @desc    Get monthly members
// @route   GET /api/users/monthly
// @access  Admin
const monthlyMembers = asyncHandler(async (req, res) => {
  const users = await User.find({
    packageID: '61e516f81a5bd094548e998e',
  }).select('-password')

  if (!users) {
    res.status(401)
    throw new Error('Users not found!')
  } else {
    res.json({
      success: true,
      code: '200',
      message: 'monthly users.',
      Data: users,
    })
  }
})
// @desc    Get yearly members
// @route   GET /api/users/yearly
// @access  Admin
const yearlyMembers = asyncHandler(async (req, res) => {
  const users = await User.find({
    packageID: '61e517231a5bd094548e9991',
  }).select('-password')

  if (!users) {
    res.status(401)
    throw new Error('Users not found!')
  } else {
    res.json({
      success: true,
      code: '200',
      message: 'yearly users.',
      Data: users,
    })
  }
})
// @desc    Get cancel members
// @route   GET /api/users/cancel
// @access  Admin
const cancelMembers = asyncHandler(async (req, res) => {
  const cancelMembers = await User.find({
    packageStatus: false,
  })

  if (!cancelMembers) {
    res.status(401)
    throw new Error('Users not found!')
  } else {
    res.json({
      success: true,
      code: '200',
      message: 'cancel users.',
      Data: cancelMembers,
    })
  }
})
// @desc    Get new members
// @route   GET /api/users/new
// @access  Admin
const newMembers = asyncHandler(async (req, res) => {
  const result = await User.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $month: '$createdAt' }, { $month: new Date() }],
        },
      },
    },
  ])
  if (!result) {
    res.status(401)
    throw new Error('Users not found!')
  } else {
    res.json({
      success: true,
      code: '200',
      message: 'new users.',
      Data: result,
    })
  }
})
// @desc    Get No of members
// @route   GET /api/users/numberOfMembers
// @access  Admin
const numberOfMembers = asyncHandler(async (req, res) => {
  const yearly = await User.countDocuments({
    packageID: '61e517231a5bd094548e9991',
  })
  const monthly = await User.countDocuments({
    packageID: '61e516f81a5bd094548e998e',
  })
  const free = await User.countDocuments({
    packageID: '62128260efa0835502296bfd',
  })
  const cancelMembers = await User.countDocuments({
    packageStatus: false,
  })

  const result = await User.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $month: '$createdAt' }, { $month: new Date() }],
        },
      },
    },
  ])
  const newMembers = result.length

  res.json({
    success: true,
    code: '200',
    message: 'Number of members.',
    Data: { yearly, monthly, free, newMembers, cancelMembers },
  })
})
export {
  authUser,
  registerUser,
  sendCode,
  getUserProfile,
  editProfile,
  updateUserbyID,
  updateUserProfile,
  getUsers,
  getUserProfilebyID,
  deleteUser,
  getUserById,
  verifyCode,
  changePassword,
  changeAccountStatus,
  getAdmins,
  getEditors,
  verifySignup,
  AddUserByAdmin,
  getUsersbyPeriod,
  deleteBulkUsers,
  freeMembers,
  monthlyMembers,
  yearlyMembers,
  newMembers,
  cancelMembers,
  numberOfMembers,
}
