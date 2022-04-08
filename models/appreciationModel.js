import mongoose from 'mongoose'

const appreciationSchema = mongoose.Schema(
  {
    region: {
      type: String,
      required: true,
    },
    regionID: {
      type: Number,
    },
    avgTax: {
      type: Number,
      default: 0,
    },
    population: {
      type: Number,
      default: 136000,
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
      default: 0,
    },
    y2022: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
)

const Appreciation = mongoose.model('Appreciation', appreciationSchema)

export default Appreciation
