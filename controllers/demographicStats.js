import asyncHandler from "express-async-handler";
// @desc    Test demographic Stats controllat
// @route   GET /api/demographic/test
// @access  Public
const Test = asyncHandler(async (req, res) => {
  res.json({ success: true, code: 200, message: "Test Demographic." });
});

// @desc    Fetch single region Appriciation and rental
// @route   GET /api/market/rental_appriciation
// @access  Public
const rentalAppreciation = asyncHandler(async (req, res) => {
  const Data = {};
  Data.appreciation = await Appreciation.findOne({
    regionID: req.body.regionID,
  });
  Data.rental = await Rental.findOne({ regionID: req.body.regionID });
  res.json({
    success: true,
    code: 200,
    message: `Rental and appreciation of region: ${req.body.regionID}`,
    Data,
  });
});

export { Test, rentalAppreciation };
