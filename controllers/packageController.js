import asyncHandler from "express-async-handler";
import Package from "../models/packageModel.js";
import User from "../models/userModel.js";

// @desc    Fetch all packages
// @route   GET /api/package
// @access  Public
const getPackages = asyncHandler(async (req, res) => {
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

  const count = await Package.countDocuments({ ...keyword });
  const packages = await Package.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    success: true,
    code: 200,
    packages,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

// @desc    Fetch single package
// @route   GET /api/package/:id
// @access  Public
const getPackageById = asyncHandler(async (req, res) => {
  const packageFound = await Package.findById(req.params.id);

  if (packageFound) {
    res.json({ success: true, code: 200, packageFound });
  } else {
    res.status(404);
    throw new Error("Package not found");
  }
});

// @desc    Delete a package
// @route   DELETE /api/package/:id
// @access  Private/Admin
const deletePackage = asyncHandler(async (req, res) => {
  const packageFound = await Package.findById(req.params.id);

  if (packageFound) {
    await packageFound.remove();
    res.json({
      success: true,
      code: "200",
      message: "Package removed successfully!",
    });
  } else {
    res.status(404);
    throw new Error("Package not found!");
  }
});

// @desc    Create a package
// @route   POST /api/package
// @access  Private
const createPackage = asyncHandler(async (req, res) => {
  const { name, price, packageType, options } = req.body;
  const packageData = new Package({
    name,
    price,
    packageType,
    options,
  });

  const createdPackage = await packageData.save();
  res.status(201).json({
    success: true,
    code: 200,
    message: "package created successfully!",
    createdPackage,
  });
});

// @desc    Update a package
// @route   PUT /api/package/:id
// @access  Private/Admin
const updatePackage = asyncHandler(async (req, res) => {
  const { name, price, packageType, options, status } = req.body;
  const packageFound = await Package.findById(req.params.id);

  if (packageFound) {
    packageFound.name = name || packageFound.name;
    packageFound.price = price || packageFound.price;
    packageFound.packageType = packageType || packageFound.packageType;
    packageFound.status = status || packageFound.status;
    packageFound.options = options || packageFound.options;

    const updatedPackage = await packageFound.save();
    res.json({
      success: true,
      code: 200,
      message: "Package updated successfully!",
      updatedPackage,
    });
  } else {
    res.status(404);
    throw new Error("Package not found");
  }
});
// @desc    Update a package status
// @route   PUT /api/package/status/:id
// @access  Private
const updatePackageStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const packageFound = await Package.findById(req.params.id);
  console.log(packageFound.status);
  if (packageFound) {
    packageFound.status = status;

    const updatedPackage = await packageFound.save();
    res.json({
      success: true,
      code: 200,
      message: "Package status updated successfully!",
      updatedPackage,
    });
  } else {
    res.status(404);
    throw new Error("Package not found");
  }
});

// @desc    Get free member
// @route   GET /api/package/free-members
// @access  Private/Admin
const getFreeMembers = asyncHandler(async (req, res) => {
  try {
    const foundPackage = await Package.findOne({
      packageType: "Free",
    });
    console.log("Found" + foundPackage);
    if (!foundPackage) {
      res.status(401);
      throw new Error("Package not found");
    }
    
    const users = await User.find({
      packageID: foundPackage._id,
    });
    if (users) {
      res.json({
        success: true,
        code: 200,
        message: "Free users!",
        users,
      });
    } else {
      res.status(401);
      throw new Error("Users not found");
    }
  } catch (err) {
    res.status(501);
    throw new Error("Server error!");
  }
});
// @desc    Get monthly member
// @route   GET /api/package/monthly-members
// @access  Private/Admin
const getMonthlyMembers = asyncHandler(async (req, res) => {
  try {
    const foundPackage = await Package.findOne({
      packageType: "Monthly Membership",
    });
    if (!foundPackage) {
      res.status(401);
      throw new Error("Package not found");
    }
    console.log("Found" + foundPackage);
    const users = await User.find({
      packageID: foundPackage._id,
    });
    if (users) {
      res.json({
        success: true,
        code: 200,
        message: "Monthly users!",
        users,
      });
    } else {
      res.status(401);
      throw new Error("Users not found");
    }
  } catch (err) {
    res.status(501);
    throw new Error("Server error!");
  }
});
// @desc    Get 24Hour member
// @route   GET /api/package/24Hour-members
// @access  Private/Admin
const get24HourMembers = asyncHandler(async (req, res) => {
  try {
    const foundPackage = await Package.findOne({
      packageType: "24 hours Membership",
    });
    if (!foundPackage) {
      res.status(401);
      throw new Error("Package not found");
    }
    console.log("Found" + foundPackage);
    const users = await User.find({
      packageID: foundPackage._id,
    });
    if (users) {
      res.json({
        success: true,
        code: 200,
        message: "24 Hours users!",
        users,
      });
    } else {
      res.status(401);
      throw new Error("Users not found");
    }
  } catch (err) {
    res.status(501);
    throw new Error("Server error!");
  }
});

export {
  getPackages,
  getPackageById,
  deletePackage,
  createPackage,
  updatePackage,
  updatePackageStatus,
  getFreeMembers,
  getMonthlyMembers,
  get24HourMembers,
};
