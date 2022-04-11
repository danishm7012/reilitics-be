import asyncHandler from 'express-async-handler'
import Category from '../models/categoryModel.js'

// @desc    Fetch all categories
// @route   GET /api/category
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  const count = await Category.countDocuments({ ...keyword })
  const categories = await Category.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({
    success: true,
    code: 200,
    categories,
    page,
    pages: Math.ceil(count / pageSize),
  })
})

// @desc    Fetch single category
// @route   GET /api/category/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const categoryFound = await Category.findById(req.params.id)

  if (categoryFound) {
    res.json({ success: true, code: 200, categoryFound })
  } else {
    res.status(404)
    throw new Error('category not found')
  }
})

// @desc    Delete a category
// @route   DELETE /api/category/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const categoryFound = await Category.findById(req.params.id)

  if (categoryFound) {
    await categoryFound.remove()
    res.json({
      success: true,
      code: '200',
      message: 'Category removed successfully!',
    })
  } else {
    res.status(404)
    throw new Error('Category not found!')
  }
})

// @desc    Create a category
// @route   POST /api/category
// @access  Private
const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, categoryStatus } = req.body
  const category = await Category.findOne({ name })

  if (!category) {
    const categoryData = new Category({
      name,
      slug,
      categoryStatus,
    })

    const createdCategory = await categoryData.save()
    res.json({
      success: true,
      code: 200,
      message: 'Category created successfully!',
      createdCategory,
    })
  } else {
    res.status(403)
    throw new Error('Category already exist!')
  }
})

// @desc    Update a category
// @route   PUT /api/category/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name, slug, categoryStatus } = req.body
  const categoryFound = await Category.findById(req.params.id)

  if (categoryFound) {
    categoryFound.name = name || categoryFound.name
    categoryFound.slug = slug || categoryFound.slug
    categoryFound.categoryStatus =
      categoryStatus || categoryFound.categoryStatus

    const updatedCategory = await categoryFound.save()
    res.json({
      success: true,
      code: 200,
      message: 'Category updated successfully!',
      updatedCategory,
    })
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

// @desc    Get categories by status
// @route   GET /api/category/status/:categoryStatus
// @access  Private/Admin
const getCategoryByStatus = asyncHandler(async (req, res) => {
  const categoriesFound = await Category.find({
    categoryStatus: req.params.categoryStatus,
  })

  if (categoriesFound) {
    res.json({
      success: true,
      code: 200,
      message: 'Category fetch successfully!',
      categoriesFound,
    })
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

// @desc    Delete bulk categories
// @route   GET /api/category/deleteBulk
// @access  Admin
const deleteBulkCategories = asyncHandler(async (req, res) => {
  const { deleteCategories } = req.body

  Category.remove({ _id: { $in: deleteCategories } })
    .then(() => {
      res.json({
        success: true,
        code: '200',
        message: 'Categories deleted successfully!',
      })
    })
    .catch((err) => {
      res.status(401)
      throw new Error('Categories not deleted!')
    })
})

export {
  getCategories,
  getCategoryById,
  deleteCategory,
  createCategory,
  updateCategory,
  getCategoryByStatus,
  deleteBulkCategories
}
