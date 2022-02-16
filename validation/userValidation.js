import Validator from "validator";
import asyncHandler from "express-async-handler";
import { isEmpty } from "./is-empty.js";
import User from "../models/userModel.js";

const validateRegisterInput = (data) => {
  let errors = "";

  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.username = !isEmpty(data.username) ? data.username : "";

  if (!Validator.isLength(data.firstName, { min: 2, max: 30 })) {
    errors = "firstName must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.firstName)) {
    errors = "firstName field is required";
  }
  if (!Validator.isLength(data.lastName, { min: 2, max: 30 })) {
    errors = "lastName must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.lastName)) {
    errors = "lastName field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors = "Email field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors = "Email is invalid";
  }

  if (Validator.isEmpty(data.password)) {
    errors = "Password field is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors = "Password must be at least 6 characters";
  }
  
  if (Validator.isEmpty(data.username)) {
    errors = "Username field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
const verifySignupInput = (data) => {
  let errors = "";

  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.username = !isEmpty(data.username) ? data.username : "";
  data.country = !isEmpty(data.country) ? data.country : "";
  data.state= !isEmpty(data.state) ? data.state : "";
  data.dob = !isEmpty(data.dob) ? data.dob : "";
  
  if (!Validator.isLength(data.firstName, { min: 2, max: 30 })) {
    errors = "firstName must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.firstName)) {
    errors = "firstName field is required";
  }
  if (!Validator.isLength(data.lastName, { min: 2, max: 30 })) {
    errors = "lastName must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.lastName)) {
    errors = "lastName field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors = "Email field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors = "Email is invalid";
  }

  if (Validator.isEmpty(data.password)) {
    errors = "Password field is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors = "Password must be at least 6 characters";
  }
  
  if (Validator.isEmpty(data.username)) {
    errors = "Username field is required";
  }
  if (Validator.isEmpty(data.country)) {
    errors = "Country field is required";
  }
  if (Validator.isEmpty(data.state)) {
    errors = "State field is required";
  }
  if (Validator.isEmpty(data.dob)) {
    errors = "DOB field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
const validateLoginInput = (data) => {
  let errors = "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.email)) {
    errors = "Email field is required";
  }
  if (Validator.isEmpty(data.password)) {
    errors = "Passoword field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export { validateRegisterInput, validateLoginInput, verifySignupInput };
