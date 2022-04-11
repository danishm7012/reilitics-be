import mongoose from 'mongoose'

const resourceSchema = mongoose.Schema(
  {
    AddedByAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
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
    fileUrl: {
      type: String,
      required: true,
    },
    noOfClicks: {
      type: Number,
      default: 0,
    },
    noOfDownloads: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

const Resource = mongoose.model('Resource', resourceSchema)

export default Resource
