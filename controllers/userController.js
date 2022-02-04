import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import Verify from "../models/verify.js";
import { validateRegisterInput, confirmemailusername } from "../validation/userValidation.js";
import { sendEmail } from "../config/sendMail.js";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user.email_varification) {
    res.status(401);
    throw new Error("Email is not verified!");
  }

  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      code: 200,
      message: "Logged in successfully!",
      token: generateToken(user._id),
      user,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
   await validateRegisterInput(req.body,res);

  const confirmation_code = Math.floor(100000 + Math.random() * 900000);
  const {
    firstName,
    lastName,
    image,
    email,
    password,
    username,
    phone,
    city,
    dob,
    packageID,
    packageStatus,
  } = req.body;


  const emailExists = await User.findOne({ email });
  const usernameExists = await User.findOne({ username });


  if (emailExists) {
    res.status(400);
    throw new Error("Email already exists");
  }
  if (usernameExists) {
    res.status(400);
    throw new Error("Username already exists");
  }
  

  const user = await User.create({
    firstName,
    lastName,
    image,
    email,
    password,
    username,
    phone,
    city,
    dob,
    packageID,
    packageStatus,
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid user data");
  } else {
    const result = await sendEmail(user);
    res.status(201).json({
      success: true,
      message: "kindly Check your email for confirmation code",
      token: generateToken(user._id),
      user,
    });
  }
});
// @desc    Resend varification code to the email
// @route   GET /api/users/sendcode
// @access  Private
const sendCode = async (req, res) => {
  console.log(req.body.email);
  User.findOne({ email: req.body.email })
    .then(async (user) => {
      await sendEmail(user); // sending code on given email
      res.status(201).json({
        success: true,
        message: "kindly Check your email for code confirmation!",
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Email doesn't exist!",
      });
    });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.accountStatus = req.body.accountStatus || user.accountStatus;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile/:id
// @access  Private/Admin
const changeAccountStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.accountStatus = req.body.accountStatus || user.accountStatus;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      code: 200,
      message: `User ${updatedUser.accountStatus} successfully!`,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await User.countDocuments({ ...keyword });
  const users = await User.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  if (!users) {
    res.status(401);
    throw new Error("Users not found");
  }

  res.json({ succes: true, users, page, pages: Math.ceil(count / pageSize) });
});
// @desc    Get Admins
// @route   GET /api/users/admins
// @access  Private/Admin
const getAdmins = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "admin" });
  if (users) {
    res.json({ success: true, code: 200, admins: users });
  } else {
    res.status(401);
    throw new Error("Users not found");
  }
});
// @desc    Get editors
// @route   GET /api/users/editors
// @access  Private/editor
const getEditors = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "editor" });
  if (users) {
    res.json({ success: true, code: 200, editors: users });
  } else {
    res.status(401);
    throw new Error("Users not found");
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user by admin
// @route   PUT /api/users
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.username = req.body.username || user.username;
    user.phone = req.body.phone || user.phone;
    user.password = req.body.password || user.password;
    user.city = req.body.city || user.city;
    user.state = req.body.state || user.state;
    user.date_of_birth = req.body.date_of_birth || user.date_of_birth;
    user.role = req.body.role || user.role;
    user.accountStatus = req.body.accountStatus || user.accountStatus;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      success: true,
      code: "200",
      data: updatedUser,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
// @desc    Verify Code
// @route   GET /api/users/verifycode
// @access  Private/Protected
const verifyCode = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const get_user = await Verify.findOne({
    user: user._id,
  });
  if (get_user == null) {
    res.status(400);
    throw new Error("User Does not exist");
  }
  console.log(`save: ${get_user.code} body:${req.body.confirmation_code}`);
  if (get_user.code != req.body.confirmation_code) {
    res.status(401);
    throw new Error("Code does not match!");
  } else {
    user.email_varification = true;
    await user.save();
    res.json({
      success: true,
      code: "200",
      message: "Email Verified successfully!",
    });
  }
});
// @desc    Change password
// @route   GET /api/users/changepassword
// @access  Public
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const get_user = await Verify.findOne({
    user: user._id,
  });
  if (get_user == null) {
    res.status(400);
    throw new Error("User Does not exist");
  }
  console.log(`save: ${get_user.code} body:${req.body.confirmation_code}`);
  if (get_user.code != req.body.confirmation_code) {
    res.status(401);
    throw new Error("Code does not match!");
  } else {
    user.password = req.body.newPassword || user.password;
    await user.save();
    res.json({
      success: true,
      code: "200",
      message: "Password has been changed successfully!",
    });
  }
});
export {
  authUser,
  registerUser,
  sendCode,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  verifyCode,
  changePassword,
  changeAccountStatus,
  getAdmins,
  getEditors,
};
