import mongoose from "mongoose";

const noteSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
