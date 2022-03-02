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
  const listPrice = await CSV().fromFile("./data/market/list_price_median.csv");
  const salePrice = await CSV().fromFile("./data/market/median_sale_price.csv");

  if (listPrice && salePrice) {
    res.json({
      success: true,
      code: 200,
      message: "median_list_vs_sale_price",
      listPrice,
      salePrice,
    });
  }
});

export { Test, medianListSales };
