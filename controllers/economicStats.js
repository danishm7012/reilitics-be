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
    employmentIndustryJson.filter((item) => {
      console.log(item)
      return item.Region == Region
    }),
    ['Region']
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
  let Data = unemployment_rateJson.map((item) => item.Region)

  res.json({
    success: true,
    code: 200,
    message: `Economic regions.`,
    Data,
  })
})

export { Test, unemploymentRate, economicRegions, employmentIndustry }
