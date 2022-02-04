import mongoose from "mongoose";

const rentalSchema = mongoose.Schema(
  {
    region: {
      type: String,
      required: true,
    },
    LLfriendly: {
      type: Number,
      required,
    },
    avgGrowth: {
      type: Number,
    },
    median: {
      type: Number,
    },
    2018: {
      type: Number,
      required: true,
    },
    2019: {
      type: Number,
      required: true,
    },
    2020: {
      type: Number,
      required: true,
    },
    2021: {
      type: Number,
      required: true,
    },
    2022: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Rental = mongoose.model("Rental", rentalSchema);

export default Rental;
