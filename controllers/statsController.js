import asyncHandler from 'express-async-handler'
import Resource from '../models/resourceModel.js'
import Rental from '../models/rentalGrowth.js'
import fs from 'fs'
import https from 'https'
import path from 'path'
import { rentalJson } from '../data/json/rental.js'
//import CSV from 'csvtojson'

// @desc    Fetch single resource
// @route   GET /api/stats/test
// @access  Public
const Test = asyncHandler(async (req, res) => {
  res.json({ success: true, code: 200, message: 'Test state' })
})

// @desc    Fetch all resources
// @route   GET /api/resource
// @access  Public
const getRentalJson = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1
  const rentaljson = await rentalJson.map((item) => {
    const result = {}
    Array.prototype.median = function () {
      return this.slice().sort((a, b) => a - b)[Math.floor(this.length / 2)]
    }
    result.region = item.RegionName
    result.y2018 = ((item['2018-12'] - item['2018-01']) / item['2018-12']) * 100
    result.y2019 = ((item['2019-12'] - item['2019-01']) / item['2019-12']) * 100
    result.y2020 = ((item['2020-12'] - item['2020-01']) / item['2020-12']) * 100
    result.y2021 = ((item['2021-12'] - item['2021-01']) / item['2021-12']) * 100
    // 2022: ((item['2022-12'] - item['2022-01']) / item['2022-12']) * 100,
    result.avgGrowth =
      (result.y2018 + result.y2019 + result.y2020 + result.y2021) / 4
    result.median = [
      item['2018-12'],
      item['2019-12'],
      item['2020-12'],
      item['2021-12'],
    ].median()
    return result
  })
  await Rental.deleteMany()
  await Rental.insertMany(rentaljson)

  const count = await Rental.countDocuments()
  const rentalResult = await Rental.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({
    success: true,
    code: 200,
    rentalResult,
    page,
    pages: Math.ceil(count / pageSize),
  })
})
// @desc    calculate market appreciation
// @route   GET /api/appreciationjson
// @access  Public
const getAppreciationJson = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1
  const rentaljson = await rentalJson.map((item) => {
    const result = {}
    Array.prototype.median = function () {
      return this.slice().sort((a, b) => a - b)[Math.floor(this.length / 2)]
    }
    result.region = item.RegionName
    result.y2018 = ((item['2018-12'] - item['2018-01']) / item['2018-12']) * 100
    result.y2019 = ((item['2019-12'] - item['2019-01']) / item['2019-12']) * 100
    result.y2020 = ((item['2020-12'] - item['2020-01']) / item['2020-12']) * 100
    result.y2021 = ((item['2021-12'] - item['2021-01']) / item['2021-12']) * 100
    // 2022: ((item['2022-12'] - item['2022-01']) / item['2022-12']) * 100,
    result.avgGrowth =
      (result.y2018 + result.y2019 + result.y2020 + result.y2021) / 4
    result.median = [
      item['2018-12'],
      item['2019-12'],
      item['2020-12'],
      item['2021-12'],
    ].median()
    return result
  })
  await Rental.deleteMany()
  await Rental.insertMany(rentaljson)

  const count = await Rental.countDocuments()
  const rentalResult = await Rental.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({
    success: true,
    code: 200,
    rentalResult,
    page,
    pages: Math.ceil(count / pageSize),
  })
})
// @desc    Fetch single resource
// @route   GET /api/stats/test
// @access  Public
const test = asyncHandler(async (req, res) => {
  res.json({ success: true, code: 200, message: 'Test succerss' })
})

// @desc    Fetch all rental growth
// @route   GET /api/rental
// @access  private
const getRental = asyncHandler(async (req, res) => {
  const pageSize = 9
  const page = Number(req.query.pageNumber) || 1

  const count = await Rental.countDocuments({})
  const rentalGrowth = await Rental.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({
    success: true,
    code: 200,
    rentalGrowth,
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
  const { title, resourceType, resourceUrl, imageUrl } = req.body
  const resourceData = new Resource({
    AddedByAdmin: req.user.id,
    title,
    resourceType,
    imageUrl,
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
  const { title, resourceType, resourceUrl, imageUrl } = req.body

  const resourceFound = await Resource.findById(req.params.id)

  if (resourceFound) {
    resourceFound.title = title || resourceFound.title
    resourceFound.resourceType = resourceType || resourceFound.resourceType
    resourceFound.resourceUrl = resourceUrl || resourceFound.resourceUrl
    resourceFound.imageUrl = imageUrl || resourceFound.imageUrl

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

export {
  Test,
  getRental,
  getResourceById,
  deleteResource,
  createResource,
  updateResource,
  getRentalJson,
  updateResourceStatus,
}
