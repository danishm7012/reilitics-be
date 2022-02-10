import asyncHandler from "express-async-handler";
import Page from "../models/pageModel.js";
import { validatePageInput } from "../validation/pageValidation.js";

const getPage = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const count = await Page.countDocuments();
  const newpage = await Page.find()
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  if (newpage) {
    res.json({
      success: true,
      code: 200,
      newpage,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } else {
    throw new Error("Pages not found");
  }
});

const createPage = asyncHandler(async (req, res) => {
    const {isValid, errors} = await validatePageInput(req.body);
    if(!isValid){
        res.status(403).json({
            success: false,
            code: 403,
            message: errors
        })
    }
  const { title, description, viewCount } = req.body;

  const newpage = new Page({
    title,
    description,
    viewCount,
  });

  const createpage = await newpage.save();
  res.status(201).json({ success: true, code: 200, createpage });
});


const updatePage = asyncHandler(async (req, res) => {
  const { title, description, viewCount } = req.body;

  const page = await Page.findById(req.params.id);
  if (page) {
    page.title = title;
    page.description = description;
    page.viewCount = viewCount;
  }
  const updatePage = await page.save();
  if (updatePage) {
    res.status(201).json({ success: true, code: 200, updatePage });
  } else {
    res.status(404);
    throw new Error("Page not found");
  }
});

const getPageById =asyncHandler(async(req,res)=>{
    const pageById = await Page.findById(req.params.id);

    if(pageById){
        res.status(201).json({ success: true, code: 200, pageById });
    } else {
      res.status(404);
      throw new Error("Page not found");
    }
})

const deletePageById = asyncHandler(async(req,res)=>{
const deletepage = await Page.findById(req.params.id);
if(deletepage){
    await deletepage.remove();
    res.status(201).json({ success: true, code: 200, message: "Page has been removed" });
} else {
  res.status(404);
  throw new Error("Page not found");
}
})

export { getPage, createPage, updatePage, getPageById, deletePageById };
