const express = require("express");
const router = express.Router();
const {
  getAllActiveProducts,
  addProduct,
  editProduct,
  deleteProduct,
  getAllNonActiveProducts,
  editProductStatus,
  uploadPhoto,
  uploadProductImage,
  getProduct,
  getActiveProduct,
  getNonactiveProduct,
} = require("../../../controllers/admin/productsController");

router.get("/active", getAllActiveProducts);
router.get("/nonactive", getAllNonActiveProducts);
router.get("/active/:id", getActiveProduct);
router.get("/nonactive/:id", getNonactiveProduct);

router.post("/add", addProduct);
router.patch("/edit/:id", editProduct);
router.patch("/edit-status/:id", editProductStatus);
router.post("/upload-image/:id", uploadPhoto, uploadProductImage);

router.delete("/delete/:id", deleteProduct);

module.exports = router;
