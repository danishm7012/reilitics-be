import { isEmpty } from "./is-empty.js";
import Validator from "validator";

const resourceInput = (data)=>{
 data.title = !isEmpty(data.title) ? data.title : "";
 data.resourceType = !isEmpty(data.resourceType) ? data.resourceType : "";
    let errors =""
   
    if(Validator.isEmpty(data.title)){
        errors = "Title field is required"
    }
    if(Validator.isEmpty(data.resourceType)){
        errors = "RsourceType field is required"
    }
    return{
        errors,
        isValid: isEmpty(errors)
    }
}

export {resourceInput}