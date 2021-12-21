const fs = require("fs");
const { Op } = require("sequelize");
const { Categories, Products } = require("../../models/");
const multer = require("multer");
const sharp = require("sharp");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");

exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Categories.findOne({
    where: { uuid: req.params.id },
  });
  if (!category) {
    return next(new AppError("Category not found with that ID", 404));
  }

  return res.status(200).send(category);
});

exports.addCategory = catchAsync(async (req, res, next) => {
  const newCategory = await Categories.create(req.body);

  return res.status(201).send(newCategory);
});

exports.editCategory = catchAsync(async (req, res, next) => {
  const category = await Categories.findOne({
    where: { uuid: req.params.id },
  });

  if (!category)
    return next(new AppError("Category did not found with that ID", 404));

  await category.update(req.body);

  return res.status(200).send(category);
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Categories.findOne({ where: { uuid: req.params.id } });

  if (!category)
    return next(new AppError("Category did not found with that ID", 404));

  if (category.image) {
    fs.unlink(`public/category/${category.uuid}_category.webp`, function (err) {
      if (err) throw err;
    });
  }
  const products = await Products.findAll({
    where: { categoryId: [category.id] },
  });

  if (products) {
    products.forEach(async (product) => {
      if (products.image) {
        fs.unlink(
          `public/product/preview/${product.uuid}_product_preview.webp`,
          function (err) {
            if (err) throw err;
          }
        );
        fs.unlink(
          `public/product/normal/${product.uuid}_product.webp`,
          function (err) {
            if (err) throw err;
          }
        );
      }
      await product.destroy();
    });
  }
  await category.destroy();

  return res.status(200).send("Successfully Deleted");
});

// Multer Properties
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadPhoto = upload.single("photo");

exports.uploadCategoryImage = catchAsync(async (req, res, next) => {
  if (!req.file)
    return next(new AppError("Please provide category Image", 404));

  const uuid = req.params.id;
  const category = await Categories.findOne({ where: { uuid } });

  if (!category)
    return next(new AppError("Category did not found with that ID", 404));

  const image = `${uuid}_category.webp`;

  await sharp(req.file.buffer)
    .toFormat("webp")
    .toFile(`public/category/${image}`);

  const updatedCategory = await category.update({
    image,
  });

  return res.status(201).send(updatedCategory);
});
