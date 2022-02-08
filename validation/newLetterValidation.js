import validator from "validator";
import { isEmpty } from "./is-empty.js";

const validatenewletter = (data)=>{
    let errors=""
 data.email = !isEmpty(data.email) ? data.email : "";

 if(validator.isEmpty(data.email)){
     errors = "Email field is required"
 }
 if(!validator.isEmail(data.email)){
     errors = "Email is invalid!"
 }
 return{
     errors,
     isValid: isEmpty(errors)
 }
}

export { validatenewletter }