const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  protect,
  sendMeCode,
  verifyMyCode,
  forgotPassword,
} = require("../../controllers/users/authController");
const {
  getMe,
  updateMe,
  deleteMe,
  updateMyPassword,
} = require("../../controllers/users/usersController");
const { getMyCart } = require("../../controllers/users/cartController");
const {
  addMyOrders,
  getMyOrders,
  getMyOrderProducts,
} = require("../../controllers/users/ordersController");

router.post("/signup", signup);

router.post("/login", login);
router.patch("/forgot-password", forgotPassword);

router.get("/my-accaunt", protect, getMe);
router.patch("/update-me", protect, updateMe);
router.delete("/delete-me", protect, deleteMe);
router.patch("/update-my-password", protect, updateMyPassword);

router.post("/my-cart", getMyCart);

router.get("/my-orders", protect, getMyOrders);
router.get("/my-order-products/:id", protect, getMyOrderProducts);
router.post("/my-orders/add", addMyOrders);

module.exports = router;
