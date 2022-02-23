import mongoose from 'mongoose'

const notificationSchma = mongoose.Schema({
    subject: String,
    description: String,
    userType:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Package'
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Notification = mongoose.model("Notification", notificationSchma)

export default Notification