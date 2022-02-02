import asyncHandler from "express-async-handler";
import Note from "../models/noteModel.js";
// @desc    Fetch all user's notes by userID
// @route   GET /api/note
// @access  Public
const getNotes = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const count = await Note.countDocuments();
  const notes = await Note.find({ user: req.user.id })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    success: true,
    code: 200,
    notes,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

// @desc    Fetch single note
// @route   GET /api/note/:id
// @access  Public
const getNoteById = asyncHandler(async (req, res) => {
  const noteFound = await Note.findById(req.params.id);

  if (noteFound) {
    res.json({ success: true, code: 200, noteDetail: noteFound });
  } else {
    res.status(404);
    throw new Error("note not found");
  }
});

// @desc    Delete a note
// @route   DELETE /api/note/:id
// @access  Private/Admin
const deleteNote = asyncHandler(async (req, res) => {
  const noteFound = await Note.findById(req.params.id);

  if (noteFound) {
    await noteFound.remove();
    res.json({
      success: true,
      code: "200",
      message: "Note removed successfully!",
    });
  } else {
    res.status(404);
    throw new Error("note not found!");
  }
});

// @desc    Create a note
// @route   POST /api/note
// @access  Private
const createNote = asyncHandler(async (req, res) => {
  const { title, detail, city, state } = req.body;
  const noteData = new Note({
    user: req.user.id,
    title,
    detail,
    city,
    state,
  });

  const createdNote = await noteData.save();
  res.status(201).json({
    success: true,
    code: 200,
    message: "Note created successfully!",
    createdNote,
  });
});

// @desc    Update a note
// @route   PUT /api/note/:id
// @access  Private/Admin
const updateNote = asyncHandler(async (req, res) => {
  const { title, noteType, noteUrl, imageUrl } = req.body;

  const noteFound = await Note.findById(req.params.id);

  if (noteFound) {
    noteFound.title = title || noteFound.title;
    noteFound.noteType = noteType || noteFound.noteType;
    noteFound.noteUrl = noteUrl || noteFound.noteUrl;
    noteFound.imageUrl = imageUrl || noteFound.imageUrl;

    const updatedNote = await noteFound.save();
    res.json({
      success: true,
      code: 200,
      message: "Note updated successfully!",
      updatedNote,
    });
  } else {
    res.status(404);
    throw new Error("Note not found");
  }
});
// @desc    Update a note status
// @route   PUT /api/note/status/:id
// @access  Private
const updateNoteStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const noteFound = await Note.findById(req.params.id);
  console.log(noteFound.status);
  if (noteFound) {
    noteFound.status = status;

    const updatedNote = await noteFound.save();
    res.json({
      success: true,
      code: 200,
      message: "Note status updated successfully!",
      updatedNote,
    });
  } else {
    res.status(404);
    throw new Error("Note not found");
  }
});

export {
  getNotes,
  getNoteById,
  deleteNote,
  createNote,
  updateNote,
  updateNoteStatus,
};
