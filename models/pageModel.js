import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      requied: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    keyword: {
      type: String,
    },
  },
  { timestamps: true }
);

const Page = mongoose.model("Page", pageSchema);

export default Page;
