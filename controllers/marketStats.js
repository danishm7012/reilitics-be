import asyncHandler from 'express-async-handler'
import CSV from 'csvtojson'
import path from 'path'
import jp from 'jsonpath'
import _ from 'lodash'
import Rental from '../models/rentalGrowth.js'
import Appreciation from '../models/appreciationModel.js'

//import CSV from 'csvtojson'

// @desc    Fetch single resource
// @route   GET /api/stats/test
// @access  Public
const Test = asyncHandler(async (req, res) => {
  res.json({ success: true, code: 200, message: 'Test state' })
})
// @desc    Fetch single region Appriciation and rental
// @route   GET /api/market/rental_appriciation
// @access  Public
const rentalAppreciation = asyncHandler(async (req, res) => {
  const Data = {}
  Data.appreciation = await Appreciation.findOne({
    regionID: req.body.regionID,
  })
  Data.rental = await Rental.findOne({ regionID: req.body.regionID })
  res.json({
    success: true,
    code: 200,
    message: `Rental and appreciation of region: ${req.body.regionID}`,
    Data,
  })
})
// @desc    Fetch all region Name
// @route   GET /api/market/regionNames
// @access  Public
const regionNames = asyncHandler(async (req, res) => {
  const inventryJSON = await CSV().fromFile('./data/market/inventry.csv')

  const regionName = await inventryJSON.map((item) =>
    _.pick(item, ['RegionName', 'RegionID'])
  )
  res.json({
    success: true,
    code: 200,
    message: 'All region names with IDs.',
    Regions: regionName,
  })
})
// @desc    Fetch Median list price vs Sales price
// @route   GET /api/stats/median_list_vs_sale_price
// @access  Private
const medianListSales = asyncHandler(async (req, res) => {
  const { regionID, year } = req.body
  let Data = {}
  const listPriceJSON = await CSV().fromFile(
    './data/market/list_price_median.csv'
  )
  const salePriceJSON = await CSV().fromFile(
    './data/market/median_sale_price.csv'
  )

  const listPrice = await _.omit(
    listPriceJSON.find((item) => {
      return item.RegionID == regionID
    }),
    ['RegionID', 'SizeRank', 'RegionName', 'RegionType', 'StateName']
  )
  const salesPrice = await _.omit(
    salePriceJSON.find((item) => item.RegionID == regionID),
    ['RegionID', 'SizeRank', 'RegionName', 'RegionType', 'StateName']
  )

  try {
    if (year) {
      Data.sales = await _.pick(salesPrice, [
        `1/31/${year}`,
        `2/28/${year}`,
        `2/29/${year}`,
        `3/31/${year}`,
        `4/30/${year}`,
        `5/31/${year}`,
        `6/30/${year}`,
        `7/31/${year}`,
        `8/31/${year}`,
        `9/30/${year}`,
        `10/31/${year}`,
        `11/30/${year}`,
        `12/31/${year}`,
      ])
      Data.listing = await _.pick(listPrice, [
        `1/31/${year}`,
        `2/28/${year}`,
        `2/29/${year}`,
        `3/31/${year}`,
        `4/30/${year}`,
        `5/31/${year}`,
        `6/30/${year}`,
        `7/31/${year}`,
        `8/31/${year}`,
        `9/30/${year}`,
        `10/31/${year}`,
        `11/30/${year}`,
        `12/31/${year}`,
      ])

      res.json({
        success: true,
        code: 200,
        message: `Sale price and list price of ${year}`,
        Data,
      })
    } else {
      Data.sales = salesPrice
      Data.listing = listPrice
      res.json({
        success: true,
        code: 200,
        message: `Sale price and list price of RegionID: ${regionID}`,
        Data,
      })
    }
  } catch (err) {
    throw new Error('Server error')
  }
})
// @desc    Fetch Median inventry
// @route   GET /api/stats/inventry
// @access  Private
const Inventry = asyncHandler(async (req, res) => {
  const { regionID, year } = req.body
  let Data
  const inventryJSON = await CSV().fromFile('./data/market/inventry.csv')

  const inventry = await _.omit(
    inventryJSON.find((item) => {
      return item.RegionID == regionID
    }),
    ['RegionID', 'SizeRank', 'RegionName', 'RegionType', 'StateName']
  )
  try {
    if (year) {
      Data = await _.pick(inventry, [
        `1/31/${year}`,
        `2/28/${year}`,
        `2/29/${year}`,
        `3/31/${year}`,
        `4/31/${year}`,
        `5/31/${year}`,
        `6/30/${year}`,
        `7/31/${year}`,
        `8/31/${year}`,
        `9/30/${year}`,
        `10/31/${year}`,
        `11/30/${year}`,
        `12/31/${year}`,
      ])
      console.log(Data)

      res.json({
        success: true,
        code: 200,
        message: `Inventry of ${year}`,
        Data,
      })
    } else {
      res.json({
        success: true,
        code: 200,
        message: `Invetry of RegionID: ${regionID}`,
        Data: inventry,
      })
    }
  } catch (err) {
    throw new Error('Server error')
  }
})
// @desc    Fetch Median days of pending
// @route   GET /api/stats/median_days_to_pending
// @access  Private
const medianDaysToPending = asyncHandler(async (req, res) => {
  const year = req.body.year
  let Data
  const median_days_to_pendingJSON = await CSV().fromFile(
    './data/market/median_days_to_pending.csv'
  )

  const median_days_to_pending = await _.omit(
    median_days_to_pendingJSON.find((item) => {
      return item.RegionID == req.body.regionID
    }),
    ['RegionID', 'SizeRank', 'RegionName', 'RegionType', 'StateName']
  )
  if (year) {
    Data = _.pick(median_days_to_pending, [
      `${year}-01-31`,
      `${year}-02-28`,
      `${year}-02-29`,
      `${year}-03-31`,
      `${year}-04-30`,
      `${year}-05-31`,
      `${year}-06-30`,
      `${year}-07-31`,
      `${year}-08-31`,
      `${year}-09-30`,
      `${year}-10-31`,
      `${year}-11-30`,
      `${year}-12-31`,
    ])

    res.json({
      success: true,
      code: 200,
      message: `Median days to pending of ${year}`,
      Data,
    })
  } else {
    res.json({
      success: true,
      code: 200,
      message: `Median days to pending`,
      Data: median_days_to_pending,
    })
  }
})
// @desc    Fetch share price cut
// @route   GET /api/stats/share_price_cut
// @access  Private
const sharePriceCut = asyncHandler(async (req, res) => {
  const year = req.body.year
  let Data
  const share_price_cutJSON = await CSV().fromFile(
    './data/market/share_price_cut.csv'
  )

  const share_price_cut = await _.omit(
    share_price_cutJSON.find((item) => {
      return item.RegionID == req.body.regionID
    }),
    ['RegionID', 'SizeRank', 'RegionName', 'RegionType', 'StateName']
  )
  if (year) {
    Data = _.pick(share_price_cut, [
      `${year}-01-31`,
      `${year}-02-28`,
      `${year}-02-29`,
      `${year}-03-31`,
      `${year}-04-30`,
      `${year}-05-31`,
      `${year}-06-30`,
      `${year}-07-31`,
      `${year}-08-31`,
      `${year}-09-30`,
      `${year}-10-31`,
      `${year}-11-30`,
      `${year}-12-31`,
    ])

    res.json({
      success: true,
      code: 200,
      message: `Share price cut of ${year}`,
      Data,
    })
  } else {
    res.json({
      success: true,
      code: 200,
      message: `Share price cut.`,
      Data: share_price_cut,
    })
  }
})
// @desc    Fetch median price cut
// @route   GET /api/stats/median_price_cut
// @access  Private
const medianPriceCut = asyncHandler(async (req, res) => {
  const { regionID, year } = req.body
  let Data
  const median_price_cutJSON = await CSV().fromFile(
    './data/market/median_price_cut.csv'
  )

  const median_price_cut = await _.omit(
    median_price_cutJSON.find((item) => {
      return item.RegionID == regionID
    }),
    ['RegionID', 'SizeRank', 'RegionName', 'RegionType', 'StateName']
  )
  if (year) {
    Data = _.pick(median_price_cut, [
      `${year}-01-31`,
      `${year}-02-28`,
      `${year}-02-29`,
      `${year}-03-31`,
      `${year}-04-30`,
      `${year}-05-31`,
      `${year}-06-30`,
      `${year}-07-31`,
      `${year}-08-31`,
      `${year}-09-30`,
      `${year}-10-31`,
      `${year}-11-30`,
      `${year}-12-31`,
    ])

    res.json({
      success: true,
      code: 200,
      message: `Median price cut of ${year}`,
      Data,
    })
  } else {
    res.json({
      success: true,
      code: 200,
      message: `Median price cut.`,
      Data: median_price_cut,
    })
  }
})
// @desc    Fetch median rental
// @route   GET /api/stats/median_rental
// @access  Private
const medianRental = asyncHandler(async (req, res) => {
  const { regionID, year } = req.body
  let Data
  const rentalJSON = await CSV().fromFile('./data/rental.csv')

  const rental = await _.omit(
    rentalJSON.find((item) => {
      return item.RegionID == regionID
    }),
    ['RegionID', 'SizeRank', 'RegionName']
  )
  try {
    if (year) {
      Data = _.pick(rental, [
        `${year}-01`,
        `${year}-02`,
        `${year}-03`,
        `${year}-04`,
        `${year}-05`,
        `${year}-06`,
        `${year}-07`,
        `${year}-08`,
        `${year}-09`,
        `${year}-10`,
        `${year}-11`,
        `${year}-12`,
      ])

      res.json({
        success: true,
        code: 200,
        message: `medianRental of ${year}`,
        Data,
      })
    } else {
      res.json({
        success: true,
        code: 200,
        message: `Median rental of RegionID: ${regionID}`,
        Data: rental,
      })
    }
  } catch (err) {
    throw new Error('Server error')
  }
})

// // @desc    Fetch Median medianRental
// // @route   GET /api/stats/medianRental
// // @access  Private
// const medianofRental = asyncHandler(async (req, res) => {
//   const { regionID, year } = req.body;
//   let Data;
//   const medianRentalJSON = await CSV().fromFile("./data/rental.csv");

//   const medianRental = await _.omit(
//     medianRentalJSON.find((item) => {
//       return item.RegionID == regionID;
//     }),
//     ["RegionID", "SizeRank", "RegionName", "RegionType", "StateName"]
//   );
//   try {
//     if (year) {
//       Data = _.pick(medianRental, [
//         `${year}-01-31`,
//         `${year}-02-28`,
//         `${year}-02-29`,
//         `${year}-03-31`,
//         `${year}-04-30`,
//         `${year}-05-31`,
//         `${year}-06-30`,
//         `${year}-07-31`,
//         `${year}-08-31`,
//         `${year}-09-30`,
//         `${year}-10-31`,
//         `${year}-11-30`,
//         `${year}-12-31`,
//       ]);

//       res.json({
//         success: true,
//         code: 200,
//         message: `medianRental of ${year}`,
//         Data,
//       });
//     } else {
//       res.json({
//         success: true,
//         code: 200,
//         message: `Invetry of RegionID: ${regionID}`,
//         Data: medianRental,
//       });
//     }
//   } catch (err) {
//     throw new Error("Server error");
//   }
// });

export {
  Test,
  rentalAppreciation,
  medianListSales,
  Inventry,
  medianDaysToPending,
  sharePriceCut,
  medianPriceCut,
  medianRental,
  regionNames,
}
