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

export { Test, medianListSales };
