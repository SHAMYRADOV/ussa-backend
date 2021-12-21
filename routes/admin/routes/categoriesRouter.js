const express = require("express");
const {
  addCategory,
  editCategory,
  deleteCategory,
  uploadPhoto,
  uploadCategoryImage,
  getCategory,
} = require("../../../controllers/admin/categoriesController");
const {
  getAllCategories,
} = require("../../../controllers/public/categoriesController");
const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategory);

router.post("/add", addCategory);
router.patch("/edit/:id", editCategory);
router.delete("/delete/:id", deleteCategory);
router.post("/upload-image/:id", uploadPhoto, uploadCategoryImage);

module.exports = router;
