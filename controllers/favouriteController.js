import asyncHandler from 'express-async-handler'
import Rental from '../models/rentalGrowth.js'
import Favourite from '../models/favouriteModel.js';
import User from '../models/userModel.js';


const addFavourite = asyncHandler (async(req,res) =>{
    const {appreciationID, regionName, userID} = req.body;

    const favourite = await new Favourite({
        appreciationID,
        regionName,
        userID,
    })

    const fav = await favourite.save();
     res.status(201).json({
        success: true,
        code: 200,
        message: "Added to Favourite",
        fav,
    })
})

const getFavourites = asyncHandler (async(req,res) =>{
    
        const myfavourite = await Favourite.find({user: req.user_id})
        res.json(myfavourite)
    
})

const deleteFavourite = asyncHandler(async (req, res) => {
    const favourite = await Favourite.findById(req.params.id)
  
    if (favourite) {
      await favourite.remove()
      res.json({ message: 'Product removed from favourites' })
    } else {
      res.status(404)
      throw new Error('No favourite found')
    }
  })


export {addFavourite,getFavourites, deleteFavourite}