import asyncHandler from 'express-async-handler'
import Account from '../models/accountModel.js'
import moment from 'moment'

// @desc    Fetch all user's accounts by userID
// @route   GET /api/account
// @access  Public
const getAccounts = asyncHandler(async (req, res) => {
  let Data = {}
  const transactions = await Account.find({})
  const total = await Account.aggregate([
    {
      $match: {
        // $and: [
        //     { hour: { $gte: 11 } },
        //     { hour: { $lte: 12 } }
        // ]
      },
    },
    { $group: { _id: null, sum: { $sum: '$income' } } },
  ])
  Data.total = total[0].sum
  Data.transactions = transactions
  res.json({
    success: true,
    code: 200,
    message: 'Total generated income.',
    Data,
  })
})
// @desc    Fetch by time period
// @route   POST /api/account
// @access  Public
const getAccountByPeriod = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.body
  let Data = {}

  const transactions = await Account.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  })

  Data.total = await transactions
    .map((item) => item.income)
    .reduce((prev, next) => prev + next)
  Data.transactions = transactions
  res.json({
    success: true,
    code: 200,
    message: `Generated income from ${moment(startDate).format(
      'MMMM D, YYYY'
    )} to ${moment(endDate).format('MMMM D, YYYY')}.`,
    Data,
  })
})

// @desc    Fetch single account
// @route   GET /api/account/:id
// @access  Public
const getAccountById = asyncHandler(async (req, res) => {
  const accountFound = await Account.findById(req.params.id)

  if (accountFound) {
    res.json({ success: true, code: 200, accountDetail: accountFound })
  } else {
    res.status(404)
    throw new Error('account not found')
  }
})

// @desc    Delete a account
// @route   DELETE /api/account/:id
// @access  Private/Admin
const deleteAccount = asyncHandler(async (req, res) => {
  const accountFound = await Account.findById(req.params.id)

  if (accountFound) {
    await accountFound.remove()
    res.json({
      success: true,
      code: '200',
      message: 'account removed successfully!',
    })
  } else {
    res.status(404)
    throw new Error('account not found!')
  }
})

// @desc    Create a account
// @route   POST /api/account
// @access  Private
const createAccount = asyncHandler(async (req, res) => {
  const { income } = req.body
  const accountData = new Account({
    income,
  })

  const createdaccount = await accountData.save()
  res.status(201).json({
    success: true,
    code: 200,
    message: 'Transaction created successfully!',
  })
})

// @desc    Update a account
// @route   PUT /api/account/:id
// @access  Private/Admin
const updateAccount = asyncHandler(async (req, res) => {
  const { title, accountType, accountUrl, imageUrl } = req.body

  const accountFound = await Account.findById(req.params.id)

  if (accountFound) {
    accountFound.title = title || accountFound.title
    accountFound.accountType = accountType || accountFound.accountType
    accountFound.accountUrl = accountUrl || accountFound.accountUrl
    accountFound.imageUrl = imageUrl || accountFound.imageUrl

    const updatedaccount = await accountFound.save()
    res.json({
      success: true,
      code: 200,
      message: 'account updated successfully!',
      updatedaccount,
    })
  } else {
    res.status(404)
    throw new Error('account not found')
  }
})
// @desc    Update a account status
// @route   PUT /api/account/status/:id
// @access  Private
const updateAccountStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const accountFound = await Account.findById(req.params.id)
  console.log(accountFound.status)
  if (accountFound) {
    accountFound.status = status

    const updatedaccount = await accountFound.save()
    res.json({
      success: true,
      code: 200,
      message: 'account status updated successfully!',
      updatedaccount,
    })
  } else {
    res.status(404)
    throw new Error('account not found')
  }
})

export {
  getAccounts,
  getAccountByPeriod,
  getAccountById,
  deleteAccount,
  createAccount,
  updateAccount,
  updateAccountStatus,
}
