import mongoose from "mongoose";

const articleSchema = mongoose.Schema(
  {
    title: {
      type: String,
      // unique: true,
      required: true,
    },
    image: {
      type: String,
    },
    detail: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    metaTitle: {
      type: String,
    },
    metaDescription: {},
    category: {
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

const Article = mongoose.model("Article", articleSchema);

export default Article;
