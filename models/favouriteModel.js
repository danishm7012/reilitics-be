import mongoose from 'mongoose'

const favouriteSchema = new mongoose.Schema(
  {
    favoriteRegions: [
      {
        regionID: { type: Number, required: true },
        regionName: { type: String, required: true },
      },
    ],
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
)

const Favourite = mongoose.model('Favourite', favouriteSchema)
export default Favourite
