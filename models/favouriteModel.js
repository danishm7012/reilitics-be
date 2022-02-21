import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema(
  {
    appreciationID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Appreciation",
    },
    regionName: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Favourite = mongoose.model('Favourite', favouriteSchema)
export default Favourite;