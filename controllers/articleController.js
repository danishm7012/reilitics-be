import asyncHandler from "express-async-handler";
import Article from "../models/articleModel.js";
import { blogdetail } from "../data/json/blogs.js";
import { uploadOnCloud } from "../config/cloudinary.js";
import moment from "moment";
// @desc    Fetch all articles
// @route   GET /api/articles
// @access  Public
const getArticles = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Article.countDocuments({ ...keyword });
  const articles = await Article.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    success: true,
    message: "Done!",
    articles,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

// @desc    Fetch single article
// @route   GET /api/articles/:id
// @access  Public
const getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (article) {
    res.json({ success: true, message: "Done!", article });
  } else {
    res.status(404);
    throw new Error("Article not found");
  }
});

// @desc    Delete a article
// @route   DELETE /api/articles/:id
// @access  Private/Admin
const deleteArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (article) {
    await article.remove();
    res.json({ success: true, message: "Article removed" });
  } else {
    res.status(404);
    throw new Error("Article not found");
  }
});

// @desc    Create a article
// @route   POST /api/articles
// @access  Private/Admin
const createArticle = asyncHandler(async (req, res) => {
  let image = "";
  if (req.file) {
    const result = await uploadOnCloud(req.file.path, "Images");
    image = result.url;
  }
  const { title, detail, author, category, metaTitle, metaDescription } =
    req.body;
  const article = new Article({
    title,
    image,
    detail,
    author,
    category,
    user: req.user._id,
    metaTitle,
    metaDescription,
  });
  try {
    const createdArticle = await article.save();
    res.status(201).json({ success: true, message: "Done!", createdArticle });
  } catch (error) {
    res.status(404);
    throw new Error("this title already exist!");
  }
});

// @desc    add many artical
// @route   Get /api/blogs
// @access  public
const createBlogs = asyncHandler(async (req, res) => {
  await Article.deleteMany();
  await Article.insertMany(blogdetail);
  const ArticleResult = await Article.find({});
  res.json({
    success: true,
    code: 200,
    ArticleResult,
  });
});

// @desc    Update a article
// @route   PUT /api/articles/:id
// @access  Private/Admin
const updateArticle = asyncHandler(async (req, res) => {
  const { title, detail, author, category, metaTitle, metaDescription } =
    req.body;

  const article = await Article.findById(req.params.id);
  let image = article.image;
  if (req.file) {
    const result = await uploadOnCloud(req.file.path, "Images");
    image = result.url;
  }

  if (article) {
    article.title = title || article.title;
    article.detail = detail || article.detail;
    article.metaDescription = metaDescription || article.metaDescription;
    article.image = image;
    article.metaTitle = metaTitle || article.metaTitle;
    article.user = req.user._id || article.user;
    article.category = category || article.category;
    article.author = author || article.author;

    const updatedArticle = await article.save();
    res.json(updatedArticle);
  } else {
    res.status(404);
    throw new Error("Article not found");
  }
});

// @desc    Create new review
// @route   POST /api/articles/:id/reviews
// @access  Private
const createArticleReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const article = await Article.findById(req.params.id);

  if (article) {
    const alreadyReviewed = article.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Article already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    article.reviews.push(review);

    article.numReviews = article.reviews.length;

    article.rating =
      article.reviews.reduce((acc, item) => item.rating + acc, 0) /
      article.reviews.length;

    await article.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Article not found");
  }
});

// @desc    Get top rated articles
// @route   GET /api/articles/top
// @access  Public
const getTopArticles = asyncHandler(async (req, res) => {
  const articles = await Article.find({}).sort({ rating: -1 }).limit(3);

  res.json(articles);
});

// @desc    Get contacts by time period
// @route   POST /api/article/byPeriod
// @access  Private/Admin
const getArticlessbyPeriod = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.body

  const articals = await Article.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  })

  res.json({
    success: true,
    code: 200,
    message: `Articles from ${moment(startDate).format(
      'MMMM D, YYYY'
    )} to ${moment(endDate).format('MMMM D, YYYY')}.`,
    Data: articals,
  })
})

// @desc    Delete bulk articles
// @route   GET /api/article/deleteBulk
// @access  Admin
const deleteBulkArticles = asyncHandler(async (req, res) => {
  const { deleteArticle } = req.body

  Article.remove({ _id: { $in: deleteArticle } })
    .then(() => {
      res.json({
        success: true,
        code: '200',
        message: 'Articles deleted successfully!',
      })
    })
    .catch((err) => {
      res.status(401)
      throw new Error('Articles not deleted!')
    })
})

export {
  getArticles,
  getArticleById,
  deleteArticle,
  createArticle,
  updateArticle,
  createArticleReview,
  getTopArticles,
  createBlogs,
  getArticlessbyPeriod,
  deleteBulkArticles
};
