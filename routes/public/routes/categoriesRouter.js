const express = require("express");

const {
  getAllCategories,
  getCategoryProducts,
} = require("../../../controllers/public/categoriesController");

const router = express.Router();

router.get("/", getAllCategories);
router.get("/products/:uuid", getCategoryProducts);

module.exports = router;
