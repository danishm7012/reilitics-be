import mongoose from "mongoose";

const packageSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    packageType: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    options: { type: [String] },
  },
  {
    timestamps: true,
  }
);

const Package = mongoose.model("Package", packageSchema);

export default Package;
