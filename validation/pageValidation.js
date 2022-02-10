import { isEmpty } from "./is-empty.js";
import Validator from "validator";



const validatePageInput = (data) => {
    let errors = "";
    data.title = !isEmpty(data.title) ? data.title : "";
    data.description = !isEmpty(data.description) ? data.description : "";
    // data.viewCount = !isEmpty(data.viewCount) ? data.viewCount : null;
  
    if (Validator.isEmpty(data.title)) {
      errors = "Title field is required";
    }
    if (Validator.isEmpty(data.description)) {
      errors = "Description field is required";
    }
    // if (Validator.isEmpty(data.viewCount)) {
    //     errors = "ViewCount field is required";
    //   }
  
    return {
      errors,
      isValid: isEmpty(errors),
    };
  };
  
  export { validatePageInput };