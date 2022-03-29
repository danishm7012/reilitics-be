import asyncHandler from "express-async-handler";
import Rental from "../models/rentalGrowth.js";
import Favourite from "../models/favouriteModel.js";
import User from "../models/userModel.js";

const addFavourite = asyncHandler(async (req, res) => {
  const { regionID, regionName } = req.body;

  const user = await Favourite.findOne({ userID: req.user.id });
  let fav;
 
  if (!user) {
    const newFavArray = [];
    let newRegion = { regionID, regionName };
    newFavArray.push(newRegion);

    const favourite = await new Favourite({
      favoriteRegions: newFavArray,
      userID: req.user.id,
    });

    fav = await favourite.save();
  } else {
    if (
      user.favoriteRegions.filter((item) => item.regionID == regionID).length >
      0
    ) {
      res.status(404);
      throw new Error("Already added!");
    }
    let newRegion = { regionID, regionName };

    user.favoriteRegions.push(newRegion);
    fav = await user.save();
  }

  res.status(201).json({
    success: true,
    code: 200,
    message: "Added to Favourite",
    favoriteRegions: fav.favoriteRegions,
  });
});
const removeFavourite = asyncHandler(async (req, res) => {
  const regionID = req.params.id;

  const user = await Favourite.findOne({ userID: req.user.id });
  let fav;
  if (!user) {
    res.status(404);
    throw new Error("You didn't add any favorite region yet!");
  } else {
    if (
      user.favoriteRegions.filter((item) => item.regionID == regionID).length >
      0
    ) {
      const removeIndex = user.favoriteRegions
        .map((item) => item.regionID.toString())
        .indexOf(regionID);
        
      // Splice out of array
      user.favoriteRegions.splice(removeIndex, 1);
      await user.save();
      res.status(200).json({
        status: "SUCCESS",
        code: 200,
        message: `Favorite region removed successfully!`,
        updatedFavorites: user.favoriteRegions,
      });
    } else {
      res.status(404);
      throw new Error("Region already removed!");
    }
  }
});

const getFavourites = asyncHandler(async (req, res) => {
  const data = await Favourite.findOne({ userID: req.user._id }).select(
    "favoriteRegions"
  );
  res.json({ success: true, code: 200, favoriteRegions: data.favoriteRegions });
});


export { addFavourite, getFavourites, removeFavourite };
