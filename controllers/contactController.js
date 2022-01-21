import asyncHandler from "express-async-handler";
import Contact from "../models/contactModel.js";
// @desc    Get contact profile
// @route   GET /api/contacts/profile
// @access  Private
const getContacts = asyncHandler(async (req, res) => {
  const contact = await Contact.find();

  if (contact) {
    res.json(contact);
  } else {
    res.status(404);
    throw new Error("contact not found");
  }
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
  res.status(201).json(createdContact);
});

export { getContacts, createContact };
