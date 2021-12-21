const { Op } = require("sequelize");
const { Products, Categories } = require("../../models");
const catchAsync = require("../../utils/catchAsync");

const fieldsForPublic = [
  "id",
  "uuid",
  "code",
  "name_tm",
  "name_ru",
  "preview_image",
  "image",
  "description_tm",
  "description_ru",
  "price",
  "discounted_price",
];

const include = [{ model: Categories, as: "category" }];

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const limit = req.query.limit || 20;
  const { offset, sort_by, as } = req.query;

  var order;
  if (sort_by && as) order = [[sort_by, as]];

  const products = await Products.findAll({
    where: { isActive: true },
    attributes: fieldsForPublic,
    order,
    limit,
    offset,
    include,
  });

  return res.status(200).send(products);
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Products.findOne({
    where: { uuid: req.params.id },
  });
  if (!product) {
    return next(new AppError("Product not found with that ID", 404));
  }

  return res.status(200).send(product);
});

//  Search
const capitalize = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

exports.searchProducts = catchAsync(async (req, res, next) => {
  const limit = req.query.limit || 20;
  let { keyword, offset, sort_by, as } = req.query;

  const towarlar = await Products.findAll();
  for (i = 0; i < towarlar.length; i++) {
    if (towarlar[i].discounted_price !== null) {
      await towarlar[i].update({ new_price: towarlar[i].discounted_price });
    } else {
      await towarlar[i].update({ new_price: towarlar[i].price });
    }
  }
  var order;
  if (sort_by && as) order = [[sort_by, as]];

  let keywordsArray = [];
  keyword = keyword.toLowerCase();
  keywordsArray.push("%" + keyword + "%");
  keyword = "%" + capitalize(keyword) + "%";
  keywordsArray.push(keyword);

  const products = await Products.findAll({
    where: {
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
      ],
      isActive: true,
    },
    order,
    limit,
    offset,
  });

  return res.status(200).send(products);
});
