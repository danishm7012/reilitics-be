import mongoose from "mongoose";

const rentalSchema = mongoose.Schema(
  {
    region: {
      type: String,
      required: true,
    },
    LLfriendly: {
      type: Number,
      default: 2,
    },
    avgGrowth: {
      type: Number,
    },
    median: {
      type: Number,
    },
    y2018: {
      type: Number,
      required: true,
    },
    y2019: {
      type: Number,
      required: true,
    },
    y2020: {
      type: Number,
      required: true,
    },
    y2021: {
      type: Number,
      required: true,
    },
    y2022: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Rental = mongoose.model("Rental", rentalSchema);

export default Rental;
