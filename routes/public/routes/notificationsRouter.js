const express = require("express");
const router = express.Router();

const {
  getAllNotifications,
  getNotification,
} = require("../../../controllers/public/notificationController");

router.get("/", getAllNotifications);
router.get("/:id", getNotification);

module.exports = router;
