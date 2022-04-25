import asyncHandler from 'express-async-handler'
import CSV from 'csvtojson'
import _ from 'lodash'

// @desc    Test demographic Stats controllat
// @route   GET /api/demographic/test
// @access  Public
const Test = asyncHandler(async (req, res) => {
  res.json({ success: true, code: 200, message: 'Test Economic.' })
})

// @desc    Fetch unemployment rate
// @route   GET /api/economic/unemployment_rate
// @access  Public
const unemploymentRate = asyncHandler(async (req, res) => {
  const { Region } = req.body

  const unemploymentRateJson = await CSV().fromFile(
    './data/ecnomic/unemployment_rate.csv'
  )

  const Data = await _.omit(
    unemploymentRateJson.find((item) => {
      return item.Region == Region
    }),
    ['Region']
  )
  res.json({
    success: true,
    code: 200,
    message: `Unemployment rates of the ${Region}.`,
    Data,
  })
})

// @desc    Fetch employement industries
// @route   GET /api/economic/industry
// @access  Public
const employmentIndustry = asyncHandler(async (req, res) => {
  const { Region } = req.body

  const employmentIndustryJson = await CSV().fromFile(
    './data/ecnomic/industry.csv'
  )

  const Data = await _.omit(
    employmentIndustryJson.find((item) => {
      return item.Region == Region
    }),
    [
      'Region',
      'Full-time, year-round civilian employed population 16 years and over',
    ]
  )

  res.json({
    success: true,
    code: 200,
    message: `Employment industries of the ${Region}.`,
    Data,
  })
})
// @desc    Fetch regions
// @route   GET /api/economic/regions
// @access  Public
const economicRegions = asyncHandler(async (req, res) => {
  const unemployment_rateJson = await CSV().fromFile(
    './data/ecnomic/unemployment_rate.csv'
  )
  let result = unemployment_rateJson.map((item) => item.Region)
  let areas = _.drop(result, 53)
  let states = _.dropRight(result, 938)

  res.json({
    success: true,
    code: 200,
    message: `Economic States and Areas.`,
    Data: { states, areas },
  })
})

export { Test, unemploymentRate, economicRegions, employmentIndustry }
