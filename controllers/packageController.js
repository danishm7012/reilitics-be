import asyncHandler from "express-async-handler";
import Package from "../models/packageModel.js";

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
// @access  Private/Admin
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
  const { name, price, packageType, options } = req.body;
  const packageFound = await Package.findById(req.params.id);

  if (packageFound) {
    packageFound.name = name || packageFound.name;
    packageFound.price = price || packageFound.name;
    packageFound.packageType = packageType || packageFound.name;

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

export {
  getPackages,
  getPackageById,
  deletePackage,
  createPackage,
  updatePackage,
};
