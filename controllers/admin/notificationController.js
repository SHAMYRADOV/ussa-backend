const fs = require("fs");
const { Op } = require("sequelize");
const { Notifications } = require("../../models/");
const multer = require("multer");
const sharp = require("sharp");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");

exports.getAllNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notifications.findAll({});

  return res.status(200).send(notifications);
});

exports.addNotification = catchAsync(async (req, res, next) => {
  const newNotification = await Notifications.create(req.body);

  // The topic name can be optionally prefixed with "/topics/".
  const topic = "ussa-users";

  const message = {
    data: {
      title: req.body.title,
      description: req.body.description,
    },
    topic: topic,
  };

  // Send a message to devices subscribed to the provided topic.
  getMessaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });

  return res.status(201).send(newNotification);
});

exports.editNotification = catchAsync(async (req, res, next) => {
  const notification = await Notifications.findOne({
    where: { uuid: req.params.id },
  });

  if (!notification)
    return next(new AppError("Notification did not found with that ID", 404));

  await notification.update(req.body);

  return res.status(200).send(notification);
});

exports.deleteNotification = catchAsync(async (req, res, next) => {
  const notification = await Notifications.findOne({
    where: { uuid: req.params.id },
  });

  if (!notification)
    return next(new AppError("Notification did not found with that ID", 404));

  if (notification.image) {
    fs.unlink(
      `public/notifications/normal/${notification.uuid}_notification.webp`,
      function (err) {
        if (err) throw err;
      }
    );
    fs.unlink(
      `public/notifications/big/${notification.uuid}_big_notification_image.webp`,
      function (err) {
        if (err) throw err;
      }
    );
  }
  await notification.destroy();

  return res.status(200).send("Successfully Deleted");
});

// Multer Properties
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadPhoto = upload.single("photo");

exports.uploadNotificationImage = catchAsync(async (req, res, next) => {
  if (!req.file)
    return next(new AppError("Please provide notification Image", 404));

  const uuid = req.params.id;
  const notification = await Notifications.findOne({ where: { uuid } });

  if (!notification)
    return next(new AppError("Notification did not found with that ID", 404));

  const image = `${uuid}_notification.webp`;
  const big_image = `${uuid}_big_notification_image.webp`;

  await sharp(req.file.buffer)
    .toFormat("webp")
    .toFile(`public/notifications/normal/${image}`);

  await sharp(req.file.buffer)
    .resize({ width: 100, height: 100 })
    .toFormat("webp")
    .webp({ quality: 90 })
    .toFile(`public/notifications/big/${big_image}`);

  const updatedNotification = await notification.update({
    image,
    big_image,
  });

  return res.status(201).send(updatedNotification);
});
