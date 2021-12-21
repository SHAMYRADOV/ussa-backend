const express = require("express");
const {
  addNotification,
  editNotification,
  deleteNotification,
  uploadPhoto,
  uploadNotificationImage,
} = require("../../../controllers/admin/notificationController");

const {
  getAllNotifications,
} = require("../../../controllers/public/notificationController");
const router = express.Router();

router.get("/", getAllNotifications);

router.post("/add", addNotification);
router.patch("/edit/:id", editNotification);
router.post("/upload-image/:id", uploadPhoto, uploadNotificationImage);

router.delete("/delete/:id", deleteNotification);

module.exports = router;
