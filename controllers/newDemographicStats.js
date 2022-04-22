import asyncHandler from 'express-async-handler'
import CSV from 'csvtojson'
import _ from 'lodash'
import axios from 'axios'

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
  // const query = `https://api.census.gov/data/2019/pep/charagegroups?get=NAME,POP&for=state:*`
  const query = `https://api.census.gov/data/2018/pep/charagegroups?get=POP,GEONAME,DATE_DESC&DATE_CODE=11&RACE=10&for=county:*&in=state:*`
  axios
    .get(query)
    .then((result) => {
      console.log(result)
      res.json({
        success: true,
        code: 200,
        message: 'Population',
        Data: result.data,
      })
    })
    .catch((error) => {
      console.error(error)
    })
})
// @desc    Fetch population by age
// @route   GET /api/demographic/population_by_age
// @access  Public
const populationByAge = asyncHandler(async (req, res) => {
  const { Region } = req.body
  const populationJson = await CSV().fromFile(
    './data/demographic/Population_by_age.csv'
  )

  const Result = await populationJson.filter((item) =>
    item.Region.includes(`${Region}`)
  )
  res.json({
    success: true,
    code: 200,
    message: `Population by age of ${Region}.`,
    Data: Result,
  })
})
// @desc    Fetch Households types (Renter vs Owners)
// @route   GET /api/demographic/renterVsOwner
// @access  Public
const renterVsOwner = asyncHandler(async (req, res) => {
  const { Region } = req.body
  console.log('before')
  const ownerVsRenter = await CSV().fromFile(
    './data/demographic/ownerVsRenter.csv'
  )
  console.log('after')

  const Result = await ownerVsRenter.filter((item) =>
    item.Region.includes(`${Region}`)
  )
  res.json({
    success: true,
    code: 200,
    message: `Household Types (Renter vs Owner) of ${Region}.`,
    Data: Result,
  })
})
// @desc    Fetch Income by Household Type
// @route   GET /api/demographic/income_by_household_type
// @access  Public
const incomeByHouseholdType = asyncHandler(async (req, res) => {
  const { Region } = req.body
  const Income_by_households = await CSV().fromFile(
    './data/demographic/Income_by_households.csv'
  )

  const Result = await Income_by_households.filter((item) =>
    item.Region.includes(`${Region}`)
  )
  res.json({
    success: true,
    code: 200,
    message: `Income by households type of ${Region}.`,
    Data: Result,
  })
})
// @desc    Fetch Household by type
// @route   GET /api/demographic/Household_by_type
// @access  Public
const householdByType = asyncHandler(async (req, res) => {
  const { Region } = req.body
  const Household_by_type = await CSV().fromFile(
    './data/demographic/Household_by_type.csv'
  )

  const Result = await Household_by_type.filter((item) =>
    item.Region.includes(`${Region}`)
  )
  res.json({
    success: true,
    code: 200,
    message: `Household by type of ${Region}.`,
    Data: Result,
  })
})
// @desc    Fetch Educational attainment
// @route   GET /api/demographic/educational_attainment
// @access  Public
const educationalAttainment = asyncHandler(async (req, res) => {
  const { Region } = req.body
  let Data = []
  let calculateObj = (Region, a1, a2, a3, a4, a5, a6) => {
    return {
      Region: Region,
      'Less than 9th grade': a1,
      '9th to 12th grade, no diploma': a2,
      'High school graduate (includes equivalency)': a3,
      'Some college, no degree': a4,
      "Associate's degree": a5,
      "Bachelor's degree": a6,
    }
  }

  const educational_attainment_json = await CSV().fromFile(
    './data/demographic/new_demographic/Education_attainment.csv'
  )

  const Result = await educational_attainment_json.find((item) =>
    item.Region.includes(`${Region}`)
  )
  //Result = Object.values(Result)
  console.log(Result)
  await Data.push(
    calculateObj(
      `${Result['Region']} Total`,
      Result['Total Less than 9th grade'],
      Result['Total 9th to 12th grade, no diploma'],
      Result['Total High school graduate (includes equivalency)'],
      Result['Total Some college, no degree'],
      Result["Total Associate's degree"],
      Result["Total Bachelor's degree"]
    )
  )
  await Data.push(
    calculateObj(
      `${Result['Region']} Male`,
      Result['Male Less than 9th grade'],
      Result['Male 9th to 12th grade, no diploma'],
      Result['Male High school graduate (includes equivalency)'],
      Result['Male Some college, no degree'],
      Result["Male Associate's degree"],
      Result["Male Bachelor's degree"]
    )
  )
  await Data.push(
    calculateObj(
      `${Result['Region']} Female`,
      Result['Female Less than 9th grade'],
      Result['Female 9th to 12th grade, no diploma'],
      Result['Female High school graduate (includes equivalency)'],
      Result['Female Some college, no degree'],
      Result["Female Associate's degree"],
      Result["Female Bachelor's degree"]
    )
  )
  await Data.push(
    calculateObj(
      `${Result['Region']} Percent`,
      Result['Percent Less than 9th grade'],
      Result['Percent 9th to 12th grade, no diploma'],
      Result['Percent High school graduate (includes equivalency)'],
      Result['Percent Some college, no degree'],
      Result["Percent Associate's degree"],
      Result["Percent Bachelor's degree"]
    )
  )

  res.json({
    success: true,
    code: 200,
    message: `Educational attainment of ${Region}.`,
    Data,
  })
})
// @desc    Fetch Population by race
// @route   GET /api/demographic/population_by_race
// @access  Public
const populationByRace = asyncHandler(async (req, res) => {
  const { Region } = req.body

  const population_by_race = await CSV().fromFile(
    './data/demographic/new_demographic/population_by_race.csv'
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
    './data/demographic/new_demographic/population.csv'
  )
  let result = populationJson.map((item) => item.Region)
  let areas = _.drop(result, 53)
  let states = _.dropRight(result, 938)

  res.json({
    success: true,
    code: 200,
    message: `Demographic States and Areas.`,
    Data: { states, areas },
  })
})

export {
  Test,
  demographicRegions,
  population,
  populationByAge,
  renterVsOwner,
  incomeByHouseholdType,
  householdByType,
  educationalAttainment,
  populationByRace,
}
