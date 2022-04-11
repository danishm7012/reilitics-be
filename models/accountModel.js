import mongoose from 'mongoose'

const accountSchema = mongoose.Schema(
  {
    income: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Account = mongoose.model('Account', accountSchema)

export default Account
