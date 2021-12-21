const express = require("express");
const {
  getAllOrders,
  getOrderProducts,
  changeOrderStatus,
  deleteOrderProduct,
} = require("../../../controllers/admin/ordersController");
const router = express.Router();

router.get("/", getAllOrders);
router.get("/order-products/:id", getOrderProducts);
router.post("/change-order-status/:id", changeOrderStatus);
router.delete("/order-products/delete/:id", deleteOrderProduct);

module.exports = router;
