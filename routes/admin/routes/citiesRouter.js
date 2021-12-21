const express = require("express");
const router = express.Router();

const {
  getAllCities,
  addCity,
  editCity,
  deleteCity,
} = require("../../../controllers/admin/citiesController");

router.get("/", getAllCities);

router.post("/add", addCity);
router.patch("/edit/:id", editCity);

router.delete("/delete/:id", deleteCity);

module.exports = router;
