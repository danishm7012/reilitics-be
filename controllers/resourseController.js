import asyncHandler from 'express-async-handler'
import Resource from '../models/resourceModel.js'
import { resourceInput } from '../validation/resourceValidation.js'
import { resourceData } from '../data/json/BooksData.js'
import { uploadOnCloud } from '../config/cloudinary.js'

// @desc    Fetch all resources
// @route   GET /api/resource
// @access  Public
const getResources = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  const count = await Resource.countDocuments({ ...keyword })
  const resources = await Resource.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({
    success: true,
    code: 200,
    resources,
    page,
    pages: Math.ceil(count / pageSize),
  })
})

// @desc    Fetch single resource
// @route   GET /api/resource/:id
// @access  Public
const getResourceById = asyncHandler(async (req, res) => {
  const resourceFound = await Resource.findById(req.params.id)

  if (resourceFound) {
    res.json({ success: true, code: 200, resourceFound })
  } else {
    res.status(404)
    throw new Error('resource not found')
  }
})

// @desc    Delete a resource
// @route   DELETE /api/resource/:id
// @access  Private/Admin
const deleteResource = asyncHandler(async (req, res) => {
  const resourceFound = await Resource.findById(req.params.id)

  if (resourceFound) {
    await resourceFound.remove()
    res.json({
      success: true,
      code: '200',
      message: 'Resource removed successfully!',
    })
  } else {
    res.status(404)
    throw new Error('Resource not found!')
  }
})

// @desc    Create a resource
// @route   POST /api/resource
// @access  Private
const createResource = asyncHandler(async (req, res) => {
  const { isValid, errors } = await resourceInput(req.body)
  if (!isValid) {
    res.status(403).json({
      success: false,
      code: 403,
      message: errors,
    })
  }
  let image = ''
  if (req.file) {
    const result = await uploadOnCloud(req.file.path, 'Images')
    image = result.url
  }

  const { title, resourceType, resourceUrl } = req.body

  const resourceData = new Resource({
    AddedByAdmin: req.user.id,
    title,
    resourceType,
    fileUrl: image,
    resourceUrl,
  })

  const createdResource = await resourceData.save()
  res.status(201).json({
    success: true,
    code: 200,
    message: 'Resource created successfully!',
    createdResource,
  })
})

// @desc    Update a resource
// @route   PUT /api/resource/:id
// @access  Private/Admin
const updateResource = asyncHandler(async (req, res) => {
  const { title, resourceType, resourceUrl } = req.body

  const resourceFound = await Resource.findById(req.params.id)
  let image = resourceFound.fileUrl
  if (req.file) {
    const result = await uploadOnCloud(req.file.path, 'Images')
    image = result.url
  }

  if (resourceFound) {
    resourceFound.title = title || resourceFound.title
    resourceFound.resourceType = resourceType || resourceFound.resourceType
    resourceFound.resourceUrl = resourceUrl || resourceFound.resourceUrl
    resourceFound.fileUrl = image

    const updatedResource = await resourceFound.save()
    res.json({
      success: true,
      code: 200,
      message: 'Resource updated successfully!',
      updatedResource,
    })
  } else {
    res.status(404)
    throw new Error('Resource not found')
  }
})
// @desc    Update a resource status
// @route   PUT /api/resource/status/:id
// @access  Private
const updateResourceStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const resourceFound = await Resource.findById(req.params.id)
  console.log(resourceFound.status)
  if (resourceFound) {
    resourceFound.status = status

    const updatedResource = await resourceFound.save()
    res.json({
      success: true,
      code: 200,
      message: 'Resource status updated successfully!',
      updatedResource,
    })
  } else {
    res.status(404)
    throw new Error('Resource not found')
  }
})

// @desc    add many resource
// @route   Get /api/resource/add many
// @access  public
const createData = asyncHandler(async (req, res) => {
  await Resource.deleteMany()
  await Resource.insertMany(resourceData)
  const ResourceResult = await Resource.find({})
  res.json({
    success: true,
    code: 200,
    ResourceResult,
  })
})

export {
  getResources,
  getResourceById,
  deleteResource,
  createResource,
  updateResource,
  updateResourceStatus,
  createData,
}
