const express = require("express");
const {
  addBanner,
  getAllBanners,
  uploadPhoto,
  uploadBannerImage,
  deleteBanner,
} = require("../../../controllers/admin/bannersController");
const router = express.Router();

router.get("/", getAllBanners);
router.post("/add", addBanner);
router.post("/upload-image/:id", uploadPhoto, uploadBannerImage);
router.delete("/delete/:id", deleteBanner);

module.exports = router;
