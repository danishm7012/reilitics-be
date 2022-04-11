import asyncHandler from "express-async-handler";
import Contact from "../models/contactModel.js";
import moment from "moment";

// @desc    Get contact profile
// @route   GET /api/contacts/profile
// @access  Private
const getContacts = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        firstName: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  const count = await Contact.countDocuments({ ...keyword })
  const contacts = await Contact.find({ ...keyword})
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  if (!contacts) {
    res.status(401)
    throw new Error('Contacts not found')
  }

  res.json({ succes: true, contacts, page, pages: Math.ceil(count / pageSize) })
});
// @desc    Create a contact
// @route   POST /api/contacts
// @access  Public
const createContact = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;
  const contact = new Contact({
    firstName,
    lastName,
    email,
    subject,
    message,
  });

  const createdContact = await contact.save();
  res.status(201).json({ success: true, code: 200, createdContact });
});

// @desc    Delete bulk contacts
// @route   GET /api/contacts/deleteBulk
// @access  Admin
const deleteBulkContacts = asyncHandler(async (req, res) => {
  const { deleteContacts } = req.body

  Contact.remove({ _id: { $in: deleteContacts } })
    .then(() => {
      res.json({
        success: true,
        code: '200',
        message: 'Contacts deleted successfully!',
      })
    })
    .catch((err) => {
      res.status(401)
      throw new Error('Contacts not deleted!')
    })
})

// @desc    Get contacts by time period
// @route   POST /api/contacts/byPeriod
// @access  Private/Admin
const getContactsbyPeriod = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.body
  console.log('ssss ')

  const contacts = await Contact.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  })

  res.json({
    success: true,
    code: 200,
    message: `Contacts from ${moment(startDate).format(
      'MMMM D, YYYY'
    )} to ${moment(endDate).format('MMMM D, YYYY')}.`,
    Data: contacts,
  })
})



export { getContacts, createContact,deleteBulkContacts,getContactsbyPeriod };
