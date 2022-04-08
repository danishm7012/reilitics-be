import asyncHandler from 'express-async-handler'
import Resource from '../models/resourceModel.js'
import Rental from '../models/rentalGrowth.js'
import fs from 'fs'
import https from 'https'
import path from 'path'
import { rentalJson } from '../data/json/rental.js'
import { appreciationJson } from '../data/json/appreciation.js'
import Appreciation from '../models/appreciationModel.js'
import CSV from 'csvtojson'
import _ from 'lodash'

Number.prototype.round = function (p) {
  p = p || 10
  return parseFloat(this.toFixed(p))
}
//import CSV from 'csvtojson'

// @desc    Fetch single resource
// @route   GET /api/stats/test
// @access  Public
const Test = asyncHandler(async (req, res) => {
  res.json({ success: true, code: 200, message: 'Test state' })
})

// @desc    Fetch All states
// @route   GET /api/stats/allStates
// @access  Public
const getStates = asyncHandler(async (req, res) => {
  const Data = await CSV().fromFile('./data/stateData/state.csv')

  res.json({
    success: true,
    code: 200,
    message: `All states.`,
    Data,
  })
})

// @desc    Fetch all renatl
// @route   GET /api/stats/rentalJson
// @access  Public
const getRentalJson = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const rentalJson = await CSV().fromFile('./data/json/rental.csv')
  const rentaljson = await rentalJson.map((item) => {
    const result = {}
    Array.prototype.median = function () {
      return this.slice().sort((a, b) => a - b)[Math.floor(this.length / 2)]
    }
    result.region = item.RegionName
    result.regionID = item.RegionID
    result.y2022 = 0
    result.y2018 = (
      ((item['2018-12'] - item['2018-01']) / item['2018-12']) *
      100
    ).round(2)
    result.y2019 = (
      ((item['2019-12'] - item['2019-01']) / item['2019-12']) *
      100
    ).round(2)
    result.y2020 = (
      ((item['2020-12'] - item['2020-01']) / item['2020-12']) *
      100
    ).round(2)
    result.y2021 = (
      ((item['2021-12'] - item['2021-01']) / item['2021-12']) *
      100
    ).round(2)
    result.y2022 = (
      ((item['2021-03'] - item['2021-01']) / item['2021-03']) *
      100
    ).round(2)
    // 2022: ((item['2022-12'] - item['2022-01']) / item['2022-12']) * 100,
    result.avgGrowth = (
      (result.y2018 +
        result.y2019 +
        result.y2020 +
        result.y2021 +
        result.y2022) /
      5
    ).round(2)
    result.median = [
      item['2018-12'],
      item['2019-12'],
      item['2020-12'],
      item['2021-12'],
    ].median()
    return result
  })

  const stateData = await CSV().fromFile('./data/stateData/state.csv')

  //updating Landlord friendly score
  await stateData.forEach((state) => {
    rentaljson.forEach((item) => {
      if (item.region.includes(state.ZILLOWSTATE)) {
        item.LLfriendly = state.LandLordFriendlyScore
      }
    })
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
    page,
    pages: Math.ceil(count / pageSize),
    rentalResult,
  })
})
// @desc    calculate market appreciation
// @route   GET /api/appreciationjson
// @access  Public
const getAppreciationJson = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1
  const appreciationJson = await CSV().fromFile('./data/json/appreciation.csv')
  const appreciationjson = await appreciationJson.map((item) => {
    const result = {}
    Array.prototype.median = function () {
      return this.slice().sort((a, b) => a - b)[Math.floor(this.length / 2)]
    }
    result.region = item.RegionName
    result.regionID = item.RegionID
    result.y2022 = 0
    result.y2018 = (
      ((item['2018-12-31'] - item['2018-01-31']) / item['2018-12-31']) *
      100
    ).round(2)
    if (isNaN(result.y2018)) {
      result.y2018 = 0
    }
    result.y2019 = (
      ((item['2019-12-31'] - item['2019-01-31']) / item['2019-12-31']) *
      100
    ).round(2)
    if (isNaN(result.y2019)) {
      result.y2019 = 0
    }
    result.y2020 = (
      ((item['2020-12-31'] - item['2020-01-31']) / item['2020-12-31']) *
      100
    ).round(2)

    if (isNaN(result.y2020)) {
      result.y2020 = 0
    }
    result.y2021 = (
      ((item['2021-12-31'] - item['2021-01-31']) / item['2021-12-31']) *
      100
    ).round(2)
    if (isNaN(result.y2021)) {
      result.y2021 = 0
    }
    result.y2022 = (
      ((item['2022-02-28'] - item['2022-01-31']) / item['2022-02-28']) *
      100
    ).round(2)
    if (isNaN(result.y2022)) {
      result.y2022 = 0
    }
    // 2022: ((item['2022-12-31'] - item['2022-01']) / item['2022-12-31']) * 100,
    result.avgGrowth = (
      (result.y2018 +
        result.y2019 +
        result.y2020 +
        result.y2021 +
        result.y2022) /
      5
    ).round(2)
    result.median = [
      item['2018-12-31'],
      item['2019-12-31'],
      item['2020-12-31'],
      item['2021-12-31'],
      item['2022-02-28'],
    ].median()

    //not calculate yet
    result.population = Math.floor(Math.random() * 999999)
    return result
  })

  const stateData = await CSV().fromFile('./data/stateData/state.csv')

  //updating AVG Property Tax
  await stateData.forEach((state) => {
    appreciationjson.forEach((item) => {
      if (item.region.includes(state.ZILLOWSTATE)) {
        item.avgTax = state.AVGPropertyTax * 100
      }
    })
  })

  await Appreciation.deleteMany()
  await Appreciation.insertMany(appreciationjson)

  const count = await Appreciation.countDocuments()
  const allRecords = await Appreciation.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({
    success: true,
    code: 200,
    allRecords,
    page,
    pages: Math.ceil(count / pageSize),
  })
})
// @desc    fetch market appreciation
// @route   GET /api/appreciation
// @access  Public
const getAppreciation = asyncHandler(async (req, res) => {
  const pageSize = 200
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        region: {
          $regex: req.query.keyword,
          // $options: 'i',
        },
      }
    : {}

  const count = await Appreciation.countDocuments({ ...keyword })
  const allRecords = await Appreciation.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({
    success: true,
    code: 200,
    page,
    pages: Math.ceil(count / pageSize),
    allRecords,
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
  const pageSize = 200
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        region: {
          $regex: req.query.keyword,
          // $options: 'i',
        },
      }
    : {}

  const count = await Rental.countDocuments({ ...keyword })
  const rentalGrowth = await Rental.find({ ...keyword })
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
  getStates,
  getRental,
  getAppreciationJson,
  getAppreciation,
  getResourceById,
  deleteResource,
  createResource,
  updateResource,
  getRentalJson,
  updateResourceStatus,
}
