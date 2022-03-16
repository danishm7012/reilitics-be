import asyncHandler from 'express-async-handler'
import CSV from 'csvtojson'
import _ from 'lodash'

// @desc    Test demographic Stats controllat
// @route   GET /api/demographic/test
// @access  Public
const Test = asyncHandler(async (req, res) => {
  res.json({ success: true, code: 200, message: 'Test Demographic.' })
})

// @desc    Fetch population
// @route   GET /api/demographic/population
// @access  Public
const population = asyncHandler(async (req, res) => {
  const { Region } = req.body
  let Data
  const populationJson = await CSV().fromFile(
    './data/demographic/population.csv'
  )

  const population = await _.omit(
    populationJson.find((item) => {
      return item.Region == Region
    }),
    ['Region']
  )
  res.json({
    success: true,
    code: 200,
    message: `Population of ${Region}.`,
    Data: population,
  })
})
// @desc    Fetch Educational attainment
// @route   GET /api/demographic/educational_attainment
// @access  Public
const educationalAttainment = asyncHandler(async (req, res) => {
  const { Region } = req.body

  const educational_attainment_json = await CSV().fromFile(
    './data/demographic/Education_attainment.csv'
  )

  const Result = educational_attainment_json.filter((item) =>
    item.Region.includes(`${Region}`)
  )

  res.json({
    success: true,
    code: 200,
    message: `Educational attainment.`,
    Data: Result,
  })
})
// @desc    Fetch Population by race
// @route   GET /api/demographic/population_by_race
// @access  Public
const populationByRace = asyncHandler(async (req, res) => {
  const { Region } = req.body

  const population_by_race = await CSV().fromFile(
    './data/demographic/population_by_race.csv'
  )

  const Data = await _.omit(
    population_by_race.find((item) => {
      return item.Region == Region
    }),
    ['Region']
  )

  res.json({
    success: true,
    code: 200,
    message: `Population of ${Region} by race.`,
    Data,
  })
})

// @desc    Fetch regions
// @route   GET /api/demographic/regions
// @access  Public
const demographicRegions = asyncHandler(async (req, res) => {
  const populationJson = await CSV().fromFile(
    './data/demographic/population.csv'
  )
  let Data = populationJson.map((item) => item.Region)

  res.json({
    success: true,
    code: 200,
    message: `Demographic regions.`,
    Data,
  })
})

export {
  Test,
  demographicRegions,
  population,
  educationalAttainment,
  populationByRace,
}
