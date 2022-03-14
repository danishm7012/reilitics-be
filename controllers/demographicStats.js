import asyncHandler from "express-async-handler";
import CSV from "csvtojson";
import _ from "lodash";

// @desc    Test demographic Stats controllat
// @route   GET /api/demographic/test
// @access  Public
const Test = asyncHandler(async (req, res) => {
  res.json({ success: true, code: 200, message: "Test Demographic." });
});

// @desc    Fetch population
// @route   GET /api/demographic/population
// @access  Public
const population = asyncHandler(async (req, res) => {
  const { Region } = req.body;
  let Data;
  const populationJson = await CSV().fromFile(
    "./data/demographic/population.csv"
  );

  const population = await _.omit(
    populationJson.find((item) => {
      return item.Region == Region;
    }),
    ["Region", "Census", "Estimates Base"]
  );
  res.json({
    success: true,
    code: 200,
    message: `Population of ${Region}.`,
    Data: population,
  });
});

// @desc    Fetch regions
// @route   GET /api/demographic/regions
// @access  Public
const demographicRegions = asyncHandler(async (req, res) => {
  const populationJson = await CSV().fromFile(
    "./data/demographic/population.csv"
  );
  let Data = populationJson.map((item) => item.Region);

  res.json({
    success: true,
    code: 200,
    message: `Demographic regions.`,
    Data,
  });
});

export { Test, demographicRegions, population };
