import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import { sendEmail } from "../config/sendMail.js";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
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
  const confirmation_code = Math.floor(100000 + Math.random() * 900000);
  console.log(confirmation_code);
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
    packageDetails,
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
    packageDetails,
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid user data");
  } else {
    console.log(user);
    const result = await sendEmail(user);
    res.status(201).json({
      success: true,
      message: "kindly Check your email for confirmation code",
      token: generateToken(user._id),
      user,
    });
  }
});

// @desc    Send varification code to the email
// @route   GET /api/users/code_verification
// @access  Private
const codeVerification = async (req, res) => {
  //console.log(req.user)
  try {
    const get_user = await User.findOne({
      email: req.body.email,
    });
    if (get_user == null)
      return res.json({
        success: false,
        error: "User does not exist",
      });
    if (get_user.confirmation_code != req.body.confirmation_code) {
      return res.json({
        success: false,
        error: "Invalid code",
      });
    }
    if (get_user != null) {
      const getuser = await User.findOneAndUpdate(
        { email: req.body.email },
        {
          email_varification: true,
        },
        { new: true }
      );
      return res.json({
        success: true,
        data: getuser,
        message: "Email verification successfull",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err,
    });
  }
};

// @desc    Resend varification code to the email
// @route   GET /api/users/resend_code
// @access  Private
const resendCode = async (req, res) => {
  //console.log(req.user)
  const confirmation_code = Math.floor(100000 + Math.random() * 900000);
  try {
    const get_user = await User.findOne({
      email: req.body.email,
    });
    if (get_user == null)
      return res.json({
        success: false,
        error: "User does not exist",
      });
    if (get_user.email_varification == true)
      return res.json({
        success: false,
        error: "Email is already verified",
      });
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });

    var mailOptions;
    let sender = "BLACK BOOKING ORG";
    var mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: req.body.email,
      subject: "Confirmation code",
      text: "Your new  confirmation code is  " + confirmation_code,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({
          success: false,
          message: error,
        });
      } else {
        return res.json({
          success: true,
          message: "kindly Check your email for confirmation code",
        });
      }
    });
    if (get_user != null) {
      const getuser = await User.findOneAndUpdate(
        { email: req.body.email },
        {
          confirmation_code: confirmation_code,
        },
        { new: true }
      );
      return res.json({
        success: true,
        data: getuser,
        message: "Code sent successfully",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err,
    });
  }
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
  const users = await User.find({});
  res.json(users);
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

// @desc    Update user
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
    user.isAdmin = req.body.isAdmin || user.isAdmin;
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
// @desc    Check password
// @route   GET /api/users/checkpassword
// @access  Private/Protected
const checkPassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user && (await user.matchPassword(req.body.oldPassword))) {
    res.json({
      succes: true,
      code: "201",
      message: "Password matched!",
    });
  } else {
    res.json({
      succes: false,
      code: "404",
      message: "Password doesn't matched!",
    });
  }
});
// @desc    Change password
// @route   PUT /api/users/changepassword
// @access  Private/Protected
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.password = req.body.newPassword || user.password;
    await user.save();
    res.json({
      succes: true,
      code: "200",
      message: "Password has been changed successfully!",
    });
  } else {
    res.json({
      succes: false,
      code: "404",
      message: "User not found!",
    });
  }
});

export {
  authUser,
  registerUser,
  codeVerification,
  resendCode,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  checkPassword,
  changePassword,
  changeAccountStatus,
};
