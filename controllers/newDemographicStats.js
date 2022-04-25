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
// @desc    Fetch population by age
// @route   GET /api/demographic/population_by_age
// @access  Public
const populationByAge = asyncHandler(async (req, res) => {
  const { Region } = req.body
  let Data = []
  let calculateObj = (
    Region,
    a1,
    a2,
    a3,
    a4,
    a5,
    a6,
    a7,
    a8,
    a9,
    a10,
    a11,
    a12,
    a13,
    a14,
    a15,
    a16,
    a17,
    a18,
    a19,
    a20,
    a21,
    a22,
    a23,
    a24,
    a25
  ) => {
    return {
      Region: Region,
      Total: a1,
      Under5years: a2,
      '5to9years': a3,
      '10to14years': a4,
      '15to19years': a5,
      '20to24years': a6,
      '25to29years': a7,
      '30to34years': a8,
      '35to39years': a9,
      '40to44years': a10,
      '45to49years': a11,
      '50to54years': a12,
      '55to59years': a13,
      '60to64years': a14,
      '65to69years': a15,
      '70to74years': a16,
      '75to79years': a17,
      '80to84years': a18,
      '85yearsandover': a19,
      Medianage: a20,
      Sexratio: a21,
      Agedependencyratio: a22,
      OldAgedependencyratio: a23,
      Childdependencyratio: a24,
      Adults: a25,
    }
  }
  const populationJson = await CSV().fromFile(
    './data/demographic/Population_by_age.csv'
  )

  const Result = await populationJson.find((item) =>
    item.Region.includes(`${Region}`)
  )
  await Data.push(
    calculateObj(
      `${Result['Region']} Total`,
      Result['Total'],
      Result['TotalUnder5years'],
      Result['Total5to9years'],
      Result['Total10to14years'],
      Result['Total15to19years'],
      Result['Total20to24years'],
      Result['Total25to29years'],
      Result['Total30to34years'],
      Result['Total35to39years'],
      Result['Total40to44years'],
      Result['Total45to49years'],
      Result['Total50to54years'],
      Result['Total55to59years'],
      Result['Total60to64years'],
      Result['Total65to69years'],
      Result['Total70to74years'],
      Result['Total75to79years'],
      Result['Total80to84years'],
      Result['Total85yearsandover'],
      Result['TotalMedianage'],
      Result['TotalSexratio'],
      Result['TotalAgedependencyratio'],
      Result['TotalOldAgedependencyratio'],
      Result['TotalChilddependencyratio'],
      Result['TotalAdults']
    )
  )
  await Data.push(
    calculateObj(
      `${Result['Region']} Male`,
      Result['MaleTotalpopulation'],
      Result['MaleUnder5years'],
      Result['Male5to9years'],
      Result['Male10to14years'],
      Result['Male15to19years'],
      Result['Male20to24years'],
      Result['Male25to29years'],
      Result['Male30to34years'],
      Result['Male35to39years'],
      Result['Male40to44years'],
      Result['Male45to49years'],
      Result['Male50to54years'],
      Result['Male55to59years'],
      Result['Male60to64years'],
      Result['Male65to69years'],
      Result['Male70to74years'],
      Result['Male75to79years'],
      Result['Male80to84years'],
      Result['Male85yearsandover'],
      Result['MaleMedianage'],
      Result['MaleSexratio'],
      Result['MaleAgedependencyratio'],
      Result['MaleOldAgedependencyratio'],
      Result['MaleChilddependencyratio'],
      Result['MaleAdults']
    )
  )
  await Data.push(
    calculateObj(
      `${Result['Region']} Percent Male`,
      Result['PercentMaleTotal'],
      Result['PercentMaleUnder5years'],
      Result['PercentMale5to9years'],
      Result['PercentMale10to14years'],
      Result['PercentMale15to19years'],
      Result['PercentMale20to24years'],
      Result['PercentMale25to29years'],
      Result['PercentMale30to34years'],
      Result['PercentMale35to39years'],
      Result['PercentMale40to44years'],
      Result['PercentMale45to49years'],
      Result['PercentMale50to54years'],
      Result['PercentMale55to59years'],
      Result['PercentMale60to64years'],
      Result['PercentMale65to69years'],
      Result['PercentMale70to74years'],
      Result['PercentMale75to79years'],
      Result['PercentMale80to84years'],
      Result['PercentMale85yearsandover'],
      Result['PercentMaleMedianage'],
      Result['PercentMaleSexratio'],
      Result['PercentMaleAgedependencyratio'],
      Result['PercentMaleOldAgedependencyratio'],
      Result['PercentMaleChilddependencyratio'],
      Result['PercentMaleAdults']
    )
  )
  await Data.push(
    calculateObj(
      `${Result['Region']} Female`,
      Result['FemaleTotalpopulation'],
      Result['FemaleUnder5years'],
      Result['Female5to9years'],
      Result['Female10to14years'],
      Result['Female15to19years'],
      Result['Female20to24years'],
      Result['Female25to29years'],
      Result['Female30to34years'],
      Result['Female35to39years'],
      Result['Female40to44years'],
      Result['Female45to49years'],
      Result['Female50to54years'],
      Result['Female55to59years'],
      Result['Female60to64years'],
      Result['Female65to69years'],
      Result['Female70to74years'],
      Result['Female75to79years'],
      Result['Female80to84years'],
      Result['Female85yearsandover'],
      Result['FemaleMedianage'],
      Result['FemaleSexratio'],
      Result['FemaleAgedependencyratio'],
      Result['FemaleOldAgedependencyratio'],
      Result['FemaleChilddependencyratio'],
      Result['FemaleAdults']
    )
  )
  await Data.push(
    calculateObj(
      `${Result['Region']} Percent  Female`,
      Result['PercentFemaleTotal'],
      Result['PercentFemaleUnder5years'],
      Result['PercentFemale5to9years'],
      Result['PercentFemale10to14years'],
      Result['PercentFemale15to19years'],
      Result['PercentFemale20to24years'],
      Result['PercentFemale25to29years'],
      Result['PercentFemale30to34years'],
      Result['PercentFemale35to39years'],
      Result['PercentFemale40to44years'],
      Result['PercentFemale45to49years'],
      Result['PercentFemale50to54years'],
      Result['PercentFemale55to59years'],
      Result['PercentFemale60to64years'],
      Result['PercentFemale65to69years'],
      Result['PercentFemale70to74years'],
      Result['PercentFemale75to79years'],
      Result['PercentFemale80to84years'],
      Result['PercentFemale85yearsandover'],
      Result['PercentFemaleMedianage'],
      Result['PercentFemaleSexratio'],
      Result['PercentFemaleAgedependencyratio'],
      Result['PercentFemaleOldAgedependencyratio'],
      Result['PercentFemaleChilddependencyratio'],
      Result['PercentFemaleAdults']
    )
  )
  res.json({
    success: true,
    code: 200,
    message: `Population by age of ${Region}.`,
    Data,
  })
})
// @desc    Fetch Households types (Renter vs Owners)
// @route   GET /api/demographic/renterVsOwner
// @access  Public
const renterVsOwner = asyncHandler(async (req, res) => {
  const { Region } = req.body
  let Data = []
  let calculateObj = (Region, a1, a2, a3) => {
    return {
      Region: Region,
      Owner: a1,
      Renter: a2,
    }
  }
  const ownerVsRenter = await CSV().fromFile(
    './data/demographic/ownerVsRenter.csv'
  )

  const Result = await ownerVsRenter.find((item) =>
    item.Region.includes(`${Region}`)
  )
  await Data.push(
    calculateObj(
      `${Result['Region']} Total`,
      Result['TotalOwner'],
      Result['TotalRenter']
    )
  )
  await Data.push(
    calculateObj(
      `${Result['Region']} Married`,
      Result['MarriedOwner'],
      Result['MarriedRenter']
    )
  )
  await Data.push(
    calculateObj(
      `${Result['Region']} Male`,
      Result['MaleOwner'],
      Result['MaleRenter']
    )
  )
  await Data.push(
    calculateObj(
      `${Result['Region']} Female`,
      Result['FemaleOwner'],
      Result['FemaleRenter']
    )
  )
  await Data.push(
    calculateObj(
      `${Result['Region']} Non Famlily`,
      Result['NonfamilyOwner'],
      Result['NonfamilyRenter']
    )
  )
  res.json({
    success: true,
    code: 200,
    message: `Household Types (Renter vs Owner) of ${Region}.`,
    Data,
  })
})
// @desc    Fetch Income by Household Type
// @route   GET /api/demographic/income_by_household_type
// @access  Public
const incomeByHouseholdType = asyncHandler(async (req, res) => {
  const { Region } = req.body
  let Data = []
  let calculateObj = (
    Region,
    a1,
    a2,
    a3,
    a4,
    a5,
    a6,
    a7,
    a8,
    a9,
    a10,
    a11,
    a12,
    a13,
    a14,
    a15
  ) => {
    return {
      Region: Region,
      Total: a1,
      'Less than $10,000': a2,
      '$10,000 to $14,999': a3,
      '$15,000 to $24,999': a4,
      '$25,000 to $34,999': a5,
      '$35,000 to $49,999': a6,
      '$50,000 to $74,999': a7,
      '$75,000 to $99,999': a8,
      '$100,000 to $149,999': a9,
      '$150,000 to $199,999': a10,
      '$200,000 or more': a11,
      'Median income': a12,
      'Mean income': a13,
      Mean: a14,
      Median: a15,
    }
  }
  const Income_by_households = await CSV().fromFile(
    './data/demographic/Income_by_households.csv'
  )

  const Result = await Income_by_households.find((item) =>
    item.Region.includes(`${Region}`)
  )
  await Data.push(
    calculateObj(
      `${Result['Region']} Households`,
      Result['Households Total'],
      Result['Households Less than $10,000'],
      Result['Households $10,000 to $14,999'],
      Result['Households $15,000 to $24,999'],
      Result['Households $25,000 to $34,999'],
      Result['Households $35,000 to $49,999'],
      Result['Households $50,000 to $74,999'],
      Result['Households $75,000 to $99,999'],
      Result['Households $100,000 to $149,999'],
      Result['Households $150,000 to $199,999'],
      Result['Households $200,000 or more'],
      Result['Households Median income (dollars)'],
      Result['Households Mean income (dollars)'],
      Result['Household median'],
      Result['Household mean']
    )
  )
  await Data.push(
    calculateObj(
      `${Result['Region']} Families`,
      Result['Families Total'],
      Result['Families Less than $10,000'],
      Result['Families $10,000 to $14,999'],
      Result['Families $15,000 to $24,999'],
      Result['Families $25,000 to $34,999'],
      Result['Families $35,000 to $49,999'],
      Result['Families $50,000 to $74,999'],
      Result['Families $75,000 to $99,999'],
      Result['Families $100,000 to $149,999'],
      Result['Families $150,000 to $199,999'],
      Result['Families $200,000 or more'],
      Result['Families Median income (dollars)'],
      Result['Families Mean income (dollars)'],
      Result['Families median'],
      Result['Families mean']
    )
  )
  await Data.push(
    calculateObj(
      `${Result['Region']} Married Families`,
      Result['Married Total'],
      Result['Married Less than $10,000'],
      Result['Married $10,000 to $14,999'],
      Result['Married $15,000 to $24,999'],
      Result['Married $25,000 to $34,999'],
      Result['Married $35,000 to $49,999'],
      Result['Married $50,000 to $74,999'],
      Result['Married $75,000 to $99,999'],
      Result['Married $100,000 to $149,999'],
      Result['Married $150,000 to $199,999'],
      Result['Married $200,000 or more'],
      Result['Married Median income (dollars)'],
      Result['Married Mean income (dollars)'],
      Result['Married median'],
      Result['Married mean']
    )
  )
  await Data.push(
    calculateObj(
      `${Result['Region']} Non Families`,
      Result['Nonfamily Total'],
      Result['Nonfamily Less than $10,000'],
      Result['Nonfamily $10,000 to $14,999'],
      Result['Nonfamily $15,000 to $24,999'],
      Result['Nonfamily $25,000 to $34,999'],
      Result['Nonfamily $35,000 to $49,999'],
      Result['Nonfamily $50,000 to $74,999'],
      Result['Nonfamily $75,000 to $99,999'],
      Result['Nonfamily $100,000 to $149,999'],
      Result['Nonfamily $150,000 to $199,999'],
      Result['Nonfamily $200,000 or more'],
      Result['Nonfamily Median income (dollars)'],
      Result['Nonfamily Mean income (dollars)'],
      Result['Nonfamily median'],
      Result['Nonfamily mean']
    )
  )

  res.json({
    success: true,
    code: 200,
    message: `Income by households type of ${Region}.`,
    Data,
  })
})
// @desc    Fetch Household by type
// @route   GET /api/demographic/Household_by_type
// @access  Public
const householdByType = asyncHandler(async (req, res) => {
  const { Region } = req.body
  let Data = []
  let calculateObj = (Region, a1, a2, a3, a4) => {
    return {
      Region: Region,
      TotalHouseholds: a1,
      AverageHouseholdSize: a2,
      AverageFamilySize: a3,
      Owned: a4,
    }
  }
  const Household_by_type = await CSV().fromFile(
    './data/demographic/Household_by_type.csv'
  )

  const Result = await Household_by_type.find((item) =>
    item.Region.includes(`${Region}`)
  )
  await Data.push(
    calculateObj(
      `${Result['Region']} Total`,
      Result['HOUSEHOLDSTotalHouseholds'],
      Result['HOUSEHOLDSAveragehouseholdsize'],
      Result['FAMILIESAveragefamilysize'],
      Result['TotalOwned']
    )
  )
  await Data.push(
    calculateObj(
      `${Result['Region']} Maried`,
      Result['MarriedTotalhouseholds'],
      Result['MarriedAveragehouseholdsize'],
      Result['MarriedAveragefamilysize'],
      Result['MarriedOwned']
    )
  )
  await Data.push(
    calculateObj(
      `${Result['Region']} Male`,
      Result['MaleTotalhouseholds'],
      Result['MaleAveragehouseholdsize'],
      Result['MaleAveragefamilysize'],
      Result['MaleOwned']
    )
  )
  await Data.push(
    calculateObj(
      `${Result['Region']} Female`,
      Result['FemaleTotalhouseholds'],
      Result['FemaleAveragehouseholdsize'],
      Result['FemaleAveragefamilysize'],
      Result['FemaleOwned']
    )
  )
  await Data.push(
    calculateObj(
      `${Result['Region']} Non Family`,
      Result['NonFamilyTotalhouseholds'],
      Result['NonfamilyAveragehouseholdsize'],
      Result['NonfamilyAveragefamilysize'],
      Result['NonfamilyOwned']
    )
  )
  res.json({
    success: true,
    code: 200,
    message: `Household by type of ${Region}.`,
    Data,
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
    './data/demographic/Education_attainment.csv'
  )

  const Result = await educational_attainment_json.find((item) =>
    item.Region.includes(`${Region}`)
  )
  //Result = Object.values(Result)

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
