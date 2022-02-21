import mongoose from 'mongoose'

const categotySchema = mongoose.Schema(
  {
    name: {
      type: String,

      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
    categoryStatus: {
      type: String,
      enum: ['published', 'drafted', 'trashed'],
      default: 'published',
    },

    postCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

const Categoty = mongoose.model('Categoty', categotySchema)

export default Categoty
