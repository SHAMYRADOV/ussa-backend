const fs = require("fs");
const { Op } = require("sequelize");
const { Cities } = require("../../models/");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");

exports.getAllCities = catchAsync(async (req, res, next) => {
  const cities = await Cities.findAll({});

  return res.status(200).send(cities);
});

exports.addCity = catchAsync(async (req, res, next) => {
  const newcity = await Cities.create(req.body);

  return res.status(201).send(newcity);
});

exports.editCity = catchAsync(async (req, res, next) => {
  const city = await Cities.findOne({
    where: { uuid: req.params.id },
  });

  if (!city) return next(new AppError("City did not found with that ID", 404));

  await city.update(req.body);

  return res.status(200).send(city);
});

exports.deleteCity = catchAsync(async (req, res, next) => {
  const city = await Cities.findOne({
    where: { uuid: req.params.id },
  });

  if (!city) return next(new AppError("City did not found with that ID", 404));

  await city.destroy();

  return res.status(200).send("Successfully Deleted");
});
