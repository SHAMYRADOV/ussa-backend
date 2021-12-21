const express = require("express");
const {
  getAllCities,
} = require("../../../controllers/public/citiesController");
const router = express.Router();

router.get("/", getAllCities);

module.exports = router;
