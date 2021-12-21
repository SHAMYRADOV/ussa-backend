const express = require("express");
const {
  getMyFavorites,
} = require("../../../controllers/public/favoritesController");
const router = express.Router();

router.post("/", getMyFavorites);

module.exports = router;
