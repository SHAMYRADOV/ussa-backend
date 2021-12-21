const fs = require("fs");
const { Op } = require("sequelize");
const { Notifications } = require("../../models/");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");

exports.getAllNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notifications.findAll({});

  return res.status(200).send(notifications);
});

exports.getNotification = catchAsync(async (req, res, next) => {
  const notification = await Notifications.findOne({
    where: { uuid: req.params.id },
  });
  if (!notification) {
    return next(new AppError("Notification not found with that ID", 404));
  }

  return res.status(200).send(notification);
});
