import asyncHandler from "express-async-handler";
import CSV from "csvtojson";
import path from "path";
import jp from "jsonpath";
import _ from "lodash";

//import CSV from 'csvtojson'

// @desc    Fetch single resource
// @route   GET /api/stats/test
// @access  Public
const Test = asyncHandler(async (req, res) => {
  res.json({ success: true, code: 200, message: "Test state" });
});
// @desc    Fetch Median list price vs Sales price
// @route   GET /api/stats/median_list_vs_sale_price
// @access  Private
const medianListSales = asyncHandler(async (req, res) => {
  console.log(req.body.regionID);
  const year = req.body.year;
  const listPriceJSON = await CSV().fromFile(
    "./data/market/list_price_median.csv"
  );
  const salePriceJSON = await CSV().fromFile(
    "./data/market/median_sale_price.csv"
  );

  const listPrice = await listPriceJSON.filter((item) => {
    return item.RegionID == req.body.regionID && item["2020-06"];
  });
  const salesPrice = await salePriceJSON.filter(
    (item) => item.RegionID == req.body.regionID
  );
  let finalMerge = [];

  if (listPrice && salesPrice) {
    res.json({
      success: true,
      code: 200,
      message: "median_list_vs_sale_price",
      listPrice,
      salesPrice,
    });
  }
});
// @desc    Fetch Median inventry
// @route   GET /api/stats/inventry
// @access  Private
const Inventry = asyncHandler(async (req, res) => {
  const { regionID, year } = req.body;
  let Data;
  const inventryJSON = await CSV().fromFile("./data/market/inventry.csv");

  const inventry = await _.omit(
    inventryJSON.find((item) => {
      return item.RegionID == regionID;
    }),
    ["RegionID", "SizeRank", "RegionName", "RegionType", "StateName"]
  );
  try {
    if (year) {
      Data = _.pick(inventry, [
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
      ]);

      res.json({
        success: true,
        code: 200,
        message: `Inventry of ${year}`,
        Data,
      });
    } else {
      res.json({
        success: true,
        code: 200,
        message: `Invetry of RegionID: ${regionID}`,
        Data: inventry,
      });
    }
  } catch (err) {
    throw new Error("Server error");
  }
});
// @desc    Fetch Median days of pending
// @route   GET /api/stats/median_days_to_pending
// @access  Private
const medianDaysToPending = asyncHandler(async (req, res) => {
  const year = req.body.year;
  let Data;
  const median_days_to_pendingJSON = await CSV().fromFile(
    "./data/market/median_days_to_pending.csv"
  );

  const median_days_to_pending = await _.omit(
    median_days_to_pendingJSON.find((item) => {
      return item.RegionID == req.body.regionID;
    }),
    ["RegionID", "SizeRank", "RegionName", "RegionType", "StateName"]
  );
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
    ]);

    res.json({
      success: true,
      code: 200,
      message: `Median days to pending of ${year}`,
      Data,
    });
  } else {
    res.json({
      success: true,
      code: 200,
      message: `Median days to pending`,
      Data: median_days_to_pending,
    });
  }
});
// @desc    Fetch share price cut
// @route   GET /api/stats/share_price_cut
// @access  Private
const sharePriceCut = asyncHandler(async (req, res) => {
  const year = req.body.year;
  let Data;
  const share_price_cutJSON = await CSV().fromFile(
    "./data/market/share_price_cut.csv"
  );

  const share_price_cut = await _.omit(
    share_price_cutJSON.find((item) => {
      return item.RegionID == req.body.regionID;
    }),
    ["RegionID", "SizeRank", "RegionName", "RegionType", "StateName"]
  );
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
    ]);

    res.json({
      success: true,
      code: 200,
      message: `Share price cut of ${year}`,
      Data,
    });
  } else {
    res.json({
      success: true,
      code: 200,
      message: `Share price cut.`,
      Data: share_price_cut,
    });
  }
});
// @desc    Fetch median price cut
// @route   GET /api/stats/median_price_cut
// @access  Private
const medianPriceCut = asyncHandler(async (req, res) => {
  const { regionID, year } = req.body;
  let Data;
  const median_price_cutJSON = await CSV().fromFile(
    "./data/market/median_price_cut.csv"
  );

  const median_price_cut = await _.omit(
    median_price_cutJSON.find((item) => {
      return item.RegionID == regionID;
    }),
    ["RegionID", "SizeRank", "RegionName", "RegionType", "StateName"]
  );
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
    ]);

    res.json({
      success: true,
      code: 200,
      message: `Median price cut of ${year}`,
      Data,
    });
  } else {
    res.json({
      success: true,
      code: 200,
      message: `Median price cut.`,
      Data: median_price_cut,
    });
  }
});
// @desc    Fetch median rental
// @route   GET /api/stats/median_rental
// @access  Private
const medianRental = asyncHandler(async (req, res) => {
  const year = req.body.year;
  const rentalJSON = await CSV().fromFile("./data/rental.csv");

  const rental = await rentalJSON.filter((item) => {
    return item.RegionID == req.body.regionID;
  });

  if (rental) {
    res.json({
      success: true,
      code: 200,
      message: `Median rental.`,
      rental,
    });
  }
});

export {
  Test,
  medianListSales,
  Inventry,
  medianDaysToPending,
  sharePriceCut,
  medianPriceCut,
  medianRental,
};
