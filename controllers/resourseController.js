import asyncHandler from "express-async-handler";
import Resource from "../models/resourceModel.js";
import { resourceInput } from "../validation/resourceValidation.js";

// @desc    Fetch all resources
// @route   GET /api/resource
// @access  Public
const getResources = asyncHandler(async (req, res) => {
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

  const count = await Resource.countDocuments({ ...keyword });
  const resources = await Resource.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    success: true,
    code: 200,
    resources,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

// @desc    Fetch single resource
// @route   GET /api/resource/:id
// @access  Public
const getResourceById = asyncHandler(async (req, res) => {
  const resourceFound = await Resource.findById(req.params.id);

  if (resourceFound) {
    res.json({ success: true, code: 200, resourceFound });
  } else {
    res.status(404);
    throw new Error("resource not found");
  }
});

// @desc    Delete a resource
// @route   DELETE /api/resource/:id
// @access  Private/Admin
const deleteResource = asyncHandler(async (req, res) => {
  const resourceFound = await Resource.findById(req.params.id);

  if (resourceFound) {
    await resourceFound.remove();
    res.json({
      success: true,
      code: "200",
      message: "Resource removed successfully!",
    });
  } else {
    res.status(404);
    throw new Error("Resource not found!");
  }
});

// @desc    Create a resource
// @route   POST /api/resource
// @access  Private
const createResource = asyncHandler(async (req, res) => {
  const { isValid, errors} = await resourceInput(req.body)
  if(!isValid){
    res.status(403).json({
      success: false,
      code: 403,
      message: errors
    })
  }
  const { title, resourceType, resourceUrl, imageUrl } = req.body;
  const resourceData = new Resource({
    AddedByAdmin: req.user.id,
    title,
    resourceType,
    imageUrl: `http://reilitics-be.herokuapp.com/${req.file.path}`,
    resourceUrl,
  });

  const createdResource = await resourceData.save();
  res.status(201).json({
    success: true,
    code: 200,
    message: "Resource created successfully!",
    createdResource,
  });
});

// @desc    Update a resource
// @route   PUT /api/resource/:id
// @access  Private/Admin
const updateResource = asyncHandler(async (req, res) => {
  const { title, resourceType, resourceUrl } = req.body;

  const resourceFound = await Resource.findById(req.params.id);
  let image;
  if (req.file) {
    image = `http://reilitics-be.herokuapp.com/${req.file.path}`;
  } else {
    image = resourceFound.imageUrl;
  }

  if (resourceFound) {
    resourceFound.title = title || resourceFound.title;
    resourceFound.resourceType = resourceType || resourceFound.resourceType;
    resourceFound.resourceUrl = resourceUrl || resourceFound.resourceUrl;
    resourceFound.imageUrl = image;

    const updatedResource = await resourceFound.save();
    res.json({
      success: true,
      code: 200,
      message: "Resource updated successfully!",
      updatedResource,
    });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});
// @desc    Update a resource status
// @route   PUT /api/resource/status/:id
// @access  Private
const updateResourceStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const resourceFound = await Resource.findById(req.params.id);
  console.log(resourceFound.status);
  if (resourceFound) {
    resourceFound.status = status;

    const updatedResource = await resourceFound.save();
    res.json({
      success: true,
      code: 200,
      message: "Resource status updated successfully!",
      updatedResource,
    });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

export {
  getResources,
  getResourceById,
  deleteResource,
  createResource,
  updateResource,
  updateResourceStatus,
};
