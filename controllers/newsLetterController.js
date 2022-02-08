import asyncHander from 'express-async-handler'
import NewsLetter from '../models/newsLetterModel.js';
import { validatenewletter } from '../validation/newLetterValidation.js';



const createNewsletter = asyncHander(async(req,res)=>{
    const {isValid, errors} = await validatenewletter(req.body);
    if(!isValid){
        res.status(403).json({
            success: false,
            code: 403,
            message: errors
        })
    }
    const {email } = req.body;

    const emailExists = await NewsLetter.findOne({email})

    if(emailExists){
        res.status(400);
            throw new Error("This Email already exists")
    }
    const news = new NewsLetter({
        email
    })
    const createNewsletter = await news.save();
    res.status(201).json({ success: true, code: 200, createNewsletter });
}) 

const getNewsLetter = asyncHander(async(req,res) =>{

    const news =  await NewsLetter.find();

    if(news)
    {
        res.json({success: true, code: 200, news})
    }
    else{
        throw new Error("NewsLetter not found")
    }


})

export {getNewsLetter, createNewsletter}