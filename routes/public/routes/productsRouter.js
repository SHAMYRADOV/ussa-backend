const express = require("express");
const {
  getAllProducts,
  searchProducts,
  getProduct,
} = require("../../../controllers/public/productsController");
const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.get("/search", searchProducts);

module.exports = router;
