const fs = require("fs");
const { Op } = require("sequelize");
const { Cities } = require("../../models/");
const catchAsync = require("../../utils/catchAsync");

exports.getAllCities = catchAsync(async (req, res, next) => {
  const cities = await Cities.findAll({});

  return res.status(200).send(cities);
});
