import asyncHandler from "express-async-handler";
import Notification from "../models/notificationModel.js";
import Package from "../models/packageModel.js";
import User from "../models/userModel.js";

const createNotification = asyncHandler(async (req, res) => {
  const { subject, description, userType } = req.body;

  const notification = new Notification({
    subject,
    description,
    userType,
    user: req.user._id,
  });

  const create = await notification.save();
  res.status(201).json({
    success: true,
    code: 200,
    message: "Notification has been genertaed",
    create,
  });
});

const getNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.find({ userType: req.params._id });
  const reverseNotification = notification.reverse();
  if (notification) {
    res.status(201).json({
      success: true,
      code: 200,
      message: "Done!",
      reverseNotification,
    });
  } else {
    res.status(404);
    throw new Error("Notifications not found");
  }
  // Object.keys(notification).forEach(function (key) {
  //  if (notification[key].userType === user[key].packageID)
  //  {
  //       res.json(notification[key])
  //   }
  // });

  // console.log("No notification found")
});

export { createNotification, getNotification };
