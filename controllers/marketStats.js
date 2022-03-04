import asyncHandler from "express-async-handler";
import CSV from "csvtojson";
import path from "path";

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
  const year = req.body.year;
  const inventryJSON = await CSV().fromFile("./data/market/inventry.csv");

  const inventry = await inventryJSON.filter((item) => {
    return item.RegionID == req.body.regionID;
  });

  if (inventry) {
    res.json({
      success: true,
      code: 200,
      message: `Invetry of ${req.body.regionID}`,
      inventry,
    });
  }
});
// @desc    Fetch Median days of pending
// @route   GET /api/stats/median_days_to_pending
// @access  Private
const medianDaysToPending = asyncHandler(async (req, res) => {
  const year = req.body.year;
  const median_days_to_pendingJSON = await CSV().fromFile(
    "./data/market/median_days_to_pending.csv"
  );

  const median_days_to_pending = await median_days_to_pendingJSON.filter(
    (item) => {
      return item.RegionID == req.body.regionID;
    }
  );

  if (median_days_to_pending) {
    res.json({
      success: true,
      code: 200,
      message: `Median days to pending of ${req.body.regionID}`,
      median_days_to_pending,
    });
  }
});

export { Test, medianListSales, Inventry, medianDaysToPending };
