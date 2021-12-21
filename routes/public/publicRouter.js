const express = require("express");
const router = express.Router();

router.use("/products", require("./routes/productsRouter"));
router.use("/categories", require("./routes/categoriesRouter"));
router.use("/cities", require("./routes/citiesRouter"));
router.use("/banners", require("./routes/bannersRouter"));
router.use("/my-favorites", require("./routes/favoritesRouter"));
router.use("/notifications", require("./routes/notificationsRouter"));

module.exports = router;
