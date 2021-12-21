const express = require("express");
const router = express.Router();

const {
  login,
  protect,
  updateMe,
} = require("./../../controllers/admin/adminController");

router.post("/login", login);
router.post("/update-me", protect, updateMe);

router.use("/products", protect, require("./routes/productsRouter"));
router.use("/users", protect, require("./routes/usersRouter"));
router.use("/categories", protect, require("./routes/categoriesRouter"));
router.use("/notifications", protect, require("./routes/notificationsRouter"));
router.use("/cities", protect, require("./routes/citiesRouter"));
router.use("/orders", protect, require("./routes/ordersRouter"));
router.use("/banners", protect, require("./routes/bannersRouter"));

module.exports = router;
