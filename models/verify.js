import mongoose from "mongoose";

const verifySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    code: {
      type: Number,
      required: true,
    },
    expired_at: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Verify = mongoose.model("Verify", verifySchema);

export default Verify;
