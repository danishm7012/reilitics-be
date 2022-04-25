// import asyncHandler from "express-async-handler";
// import CSV from "csvtojson";
// import _ from "lodash";

// // @desc    Test demographic Stats controllat
// // @route   GET /api/demographic/test
// // @access  Public
// const Test = asyncHandler(async (req, res) => {
//   res.json({ success: true, code: 200, message: "Test Demographic." });
// });

// // @desc    Fetch population
// // @route   GET /api/demographic/population
// // @access  Public
// const population = asyncHandler(async (req, res) => {
//   const { Region } = req.body;
//   let Data;
//   const populationJson = await CSV().fromFile(
//     "./data/demographic/population.csv"
//   );

//   const population = await _.omit(
//     populationJson.find((item) => {
//       return item.Region == Region;
//     }),
//     ["Region"]
//   );
//   res.json({
//     success: true,
//     code: 200,
//     message: `Population of ${Region}.`,
//     Data: population,
//   });
// });
// // @desc    Fetch population by age
// // @route   GET /api/demographic/population_by_age
// // @access  Public
// const populationByAge = asyncHandler(async (req, res) => {
//   const { Region } = req.body;
//   const populationJson = await CSV().fromFile(
//     "./data/demographic/Population_by_age.csv"
//   );

//   const Result = await populationJson.filter((item) =>
//     item.Region.includes(`${Region}`)
//   );
//   res.json({
//     success: true,
//     code: 200,
//     message: `Population by age of ${Region}.`,
//     Data: Result,
//   });
// });
// // @desc    Fetch Households types (Renter vs Owners)
// // @route   GET /api/demographic/renterVsOwner
// // @access  Public
// const renterVsOwner = asyncHandler(async (req, res) => {
//   const { Region } = req.body;
//   console.log("before")
//   const ownerVsRenter = await CSV().fromFile(
//     "./data/demographic/ownerVsRenter.csv"
//   );
//   console.log("after")

//   const Result = await ownerVsRenter.filter((item) =>
//     item.Region.includes(`${Region}`)
//   );
//   res.json({
//     success: true,
//     code: 200,
//     message: `Household Types (Renter vs Owner) of ${Region}.`,
//     Data: Result,
//   });
// });
// // @desc    Fetch Income by Household Type
// // @route   GET /api/demographic/income_by_household_type
// // @access  Public
// const incomeByHouseholdType = asyncHandler(async (req, res) => {
//   const { Region } = req.body;
//   const Income_by_households = await CSV().fromFile(
//     "./data/demographic/Income_by_households.csv"
//   );

//   const Result = await Income_by_households.filter((item) =>
//     item.Region.includes(`${Region}`)
//   );
//   res.json({
//     success: true,
//     code: 200,
//     message: `Income by households type of ${Region}.`,
//     Data: Result,
//   });
// });
// // @desc    Fetch Household by type
// // @route   GET /api/demographic/Household_by_type
// // @access  Public
// const householdByType = asyncHandler(async (req, res) => {
//   const { Region } = req.body;
//   const Household_by_type = await CSV().fromFile(
//     "./data/demographic/Household_by_type.csv"
//   );

//   const Result = await Household_by_type.filter((item) =>
//     item.Region.includes(`${Region}`)
//   );
//   res.json({
//     success: true,
//     code: 200,
//     message: `Household by type of ${Region}.`,
//     Data: Result,
//   });
// });
// // @desc    Fetch Educational attainment
// // @route   GET /api/demographic/educational_attainment
// // @access  Public
// const educationalAttainment = asyncHandler(async (req, res) => {
//   const { Region } = req.body;

//   const educational_attainment_json = await CSV().fromFile(
//     "./data/demographic/Education_attainment.csv"
//   );

//   const Result = await educational_attainment_json.filter((item) =>
//     item.Region.includes(`${Region}`)
//   );

//   res.json({
//     success: true,
//     code: 200,
//     message: `Educational attainment of ${Region}.`,
//     Data: Result,
//   });
// });
// // @desc    Fetch Population by race
// // @route   GET /api/demographic/population_by_race
// // @access  Public
// const populationByRace = asyncHandler(async (req, res) => {
//   const { Region } = req.body;

//   const population_by_race = await CSV().fromFile(
//     "./data/demographic/population_by_race.csv"
//   );

//   const Data = await _.omit(
//     population_by_race.find((item) => {
//       return item.Region == Region;
//     }),
//     ["Region"]
//   );

//   res.json({
//     success: true,
//     code: 200,
//     message: `Population of ${Region} by race.`,
//     Data,
//   });
// });

// // @desc    Fetch regions
// // @route   GET /api/demographic/regions
// // @access  Public
// const demographicRegions = asyncHandler(async (req, res) => {
//   const populationJson = await CSV().fromFile(
//     "./data/demographic/population.csv"
//   );
//   let Data = populationJson.map((item) => item.Region);

//   res.json({
//     success: true,
//     code: 200,
//     message: `Demographic regions.`,
//     Data,
//   });
// });

// export {
//   Test,
//   demographicRegions,
//   population,
//   populationByAge,
//   renterVsOwner,
//   incomeByHouseholdType,
//   householdByType,
//   educationalAttainment,
//   populationByRace,
// };
