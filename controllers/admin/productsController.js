const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");
const Op = require("sequelize").Op;
const AppError = require("../../utils/appError");
const { Products, Categories } = require("../../models");
const catchAsync = require("../../utils/catchAsync");

const include = [
  {
    model: Categories,
    as: "category",
    include: [
      {
        model: Categories,
        as: "subcategories",
      },
    ],
  },
];

const capitalize = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

exports.getAllActiveProducts = catchAsync(async (req, res) => {
  const limit = req.query.limit || 20;
  let { offset, keyword, categoryId } = req.query;

  var where = {
    isActive: true,
  };
  if (keyword) {
    let keywordsArray = [];
    keyword = keyword.toLowerCase();
    keywordsArray.push("%" + keyword + "%");
    keyword = "%" + capitalize(keyword) + "%";
    keywordsArray.push(keyword);

    where = {
      [Op.or]: [
        {
          name_tm: {
            [Op.like]: {
              [Op.any]: keywordsArray,
            },
          },
        },
        {
          name_ru: {
            [Op.like]: {
              [Op.any]: keywordsArray,
            },
          },
        },
        {
          code: {
            [Op.eq]: req.query.keyword,
          },
        },
      ],
      isActive: true,
    };
  }

  if (categoryId) where.categoryId = categoryId;

  const products = await Products.findAll({
    where,
    limit,
    offset,
    order: [["updatedAt", "DESC"]],
    include,
  });

  return res.status(200).send(products);
});

exports.getAllNonActiveProducts = catchAsync(async (req, res, next) => {
  const limit = req.query.limit || 20;
  let { offset, keyword, categoryId } = req.query;

  var where = {
    isActive: false,
  };
  if (keyword) {
    let keywordsArray = [];
    keyword = keyword.toLowerCase();
    keywordsArray.push("%" + keyword + "%");
    keyword = "%" + capitalize(keyword) + "%";
    keywordsArray.push(keyword);

    where = {
      [Op.or]: [
        {
          name_tm: {
            [Op.like]: {
              [Op.any]: keywordsArray,
            },
          },
        },
        {
          name_ru: {
            [Op.like]: {
              [Op.any]: keywordsArray,
            },
          },
        },
        {
          code: {
            [Op.eq]: req.query.keyword,
          },
        },
      ],
      isActive: false,
    };
  }

  if (categoryId) where.categoryId = categoryId;

  const products = await Products.findAll({
    where,
    limit,
    offset,
    order: [["updatedAt", "DESC"]],
    include,
  });

  return res.status(200).send(products);
});

exports.getActiveProduct = catchAsync(async (req, res, next) => {
  const product = await Products.findOne({
    where: { uuid: req.params.id, isActive: true },
  });
  if (!product) {
    return next(new AppError("Product not found with that ID", 404));
  }

  return res.status(200).send(product);
});

exports.getNonactiveProduct = catchAsync(async (req, res, next) => {
  const product = await Products.findOne({
    where: { uuid: req.params.id, isActive: false },
  });
  if (!product) {
    return next(new AppError("Product not found with that ID", 404));
  }

  return res.status(200).send(product);
});

exports.addProduct = catchAsync(async (req, res, next) => {
  const category = await Categories.findOne({
    where: { id: [req.body.categoryId] },
  });
  if (!category)
    return next(new AppError("Category did not found with that ID", 404));

  const newProduct = await Products.create(req.body);

  return res.status(201).send(newProduct);
});

exports.editProduct = catchAsync(async (req, res, next) => {
  const product = await Products.findOne({
    where: { uuid: req.params.id },
  });

  if (!product)
    return next(new AppError("Product did not found with that ID", 404));

  const category = await Categories.findOne({
    where: { id: product.categoryId },
  });
  if (!category)
    return next(new AppError("Category did not found with that ID", 404));

  await product.update(req.body);

  return res.status(200).send(product);
});

exports.editProductStatus = catchAsync(async (req, res, next) => {
  const product = await Products.findOne({
    where: { uuid: req.params.id },
  });
  if (!product)
    return next(new AppError("Product did not found with that ID", 404));

  await product.update({
    isActive: req.body.isActive,
  });

  return res.status(200).send(product);
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Products.findOne({ where: { uuid: req.params.id } });

  if (!product)
    return next(new AppError("Product did not found with that ID", 404));

  if (product.image) {
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

exports.uploadProductImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError("Please provide Product Image", 404));

  const uuid = req.params.id;
  const product = await Products.findOne({ where: { uuid } });

  if (!product)
    return next(new AppError("Product did not found with that ID", 404));

  const image = `${uuid}_product.webp`;
  const preview_image = `${uuid}_product_preview.webp`;

  await sharp(req.file.buffer)
    .toFormat("webp")
    .webp({ quality: 90 })
    .toFile(`public/product/normal/${image}`);

  await sharp(req.file.buffer)
    .toFormat("webp")
    .webp({ quality: 90 })
    .toFile(`public/product/preview/${preview_image}`);

  const updatedProduct = await product.update({
    image,
    preview_image,
  });

  return res.status(201).send(updatedProduct);
});
