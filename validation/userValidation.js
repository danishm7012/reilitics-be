import Validator from "validator";
import asyncHandler from "express-async-handler";
import { isEmpty } from "./is-empty.js";
import User from "../models/userModel.js";

const validateRegisterInput = (data, res, req) => {

  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.username = !isEmpty(data.username) ? data.username : "";

  if (!Validator.isLength(data.firstName, { min: 2, max: 30 })) {
    return res.status(403).json({
      success: false,
      code: 403,
      message: "firstName must be between 2 and 30 characters",
    });
  }

  if (Validator.isEmpty(data.firstName)) {
    return res
      .status(403)
      .json({
        success: false,
        code: 403,
        message: "firstName field is required",
      });
  }
  if (!Validator.isLength(data.lastName, { min: 2, max: 30 })) {
    return res
      .status(403)
      .json({
        success: false,
        code: 403,
        message: "lastname must be between 2 and 30 characters",
      });
  }

  if (Validator.isEmpty(data.lastName)) {
    return res
      .status(403)
      .json({
        success: false,
        code: 403,
        message: "lastName field is required",
      });
  }

  if (Validator.isEmpty(data.email)) {
    return res
      .status(403)
      .json({ success: false, code: 403, message: "Email field is required" });
  }

  if (!Validator.isEmail(data.email)) {
    return res
      .status(403)
      .json({ success: false, code: 403, message: "Email is invalid" });
  }

  if (Validator.isEmpty(data.password)) {
    return res
      .status(403)
      .json({
        success: false,
        code: 403,
        message: "Password field is required",
      });
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    return res
      .status(403)
      .json({
        success: false,
        code: 403,
        message: "Password must be at least 6 characters",
      });
  }

  if (Validator.isEmpty(data.username)) {
    return res
      .status(403)
      .json({
        success: false,
        code: 403,
        message: "Username field is required",
      });
  }
  if (
    !Validator.isLength(data.username, { min: 6, max: 20 }) &&
    !Validator.isAlphanumeric(data.username)
  ) {
    return res
      .status(403)
      .json({
        success: false,
        code: 403,
        message: "Username must be at least 6 characters",
      });
  }
};

const confirmemailusername = asyncHandler(
  async (emailExists, usernameExists) => {
    let errors = {};
    if (emailExists) {
      errors.emailExists = "Email already exists";
    }
    if (usernameExists) {
      errors.usernameExists = "Username already exists";
    }
    return {
      errors,
    };
  }
);
export { validateRegisterInput, confirmemailusername };
