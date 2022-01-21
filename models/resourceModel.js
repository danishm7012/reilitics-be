import mongoose from "mongoose";

const resourceSchema = mongoose.Schema(
  {
    AddedByAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      required: true,
    },
    resourceUrl: {
      type: String,
    },
    imageUrl: {
      type: String,
      default: "/uploads/resource.png",
    },
    noOfClicks: {
      type: Number,
    },
    noOfDownloads: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;
