const express = require("express");
const {
  getAllBanners,
} = require("../../../controllers/admin/bannersController");
const router = express.Router();

router.get("/", getAllBanners);

module.exports = router;
