import asyncHandler from 'express-async-handler'
import Notification from '../models/notificationModel.js';
import Package from '../models/packageModel.js';
import User from '../models/userModel.js'

const createNotification =asyncHandler(async(req,res)=>{
    const {subject, description, userType} = req.body;

    const notification = new Notification({
        subject,
        description,
        userType,
        user: req.user._id
    })

    const create = await notification.save();
    res.status(201).json({
        success: true,
        code: 200,
        message: "Notification has been genertaed",
        create
    })
})

const getNotification = asyncHandler(async(req,res)=>{

    const notification = await Notification.find({user: req.user._id})
    const user = await User.find({})
    
    if( user[0].packageID === notification[0].userType)  
    {
        console.log(user[0].packageID)
        console.log(notification[0].userType)
        console.log("packge id from notification",notification)
    }
    else{
        console.log("no result found")
    }
    // res.json(notification)
    
    // console.log(pkg)

})

export {createNotification, getNotification}