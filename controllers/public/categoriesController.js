const { Products, Categories } = require("../../models");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset;

  const categories = await Categories.findAll({
    limit,
    offset,
    order: [["id", "ASC"]],
    where: { parentId: null },
    include: [
      {
        model: Categories,
        as: "subcategories",
        include: [
          {
            model: Categories,
            as: "subcategories",
          },
        ],
      },
      // {
      //   model: Products,
      //   as: "category_products",
      // },
    ],
  });

  return res.status(200).send(categories);
});

exports.getCategoryProducts = catchAsync(async (req, res, next) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset;
  const { sort_by, as, discounted } = req.query;
  const category = await Categories.findOne({
    where: { uuid: req.params.uuid },
  });
  if (!category) return next(new AppError("Category not found", 404));

  let isDiscounted = null,
    order;
  if (sort_by && as) order = [[sort_by, as]];
  if (discounted == "true") isDiscounted = true;

  const products = await Products.findAll({
    where: { categoryId: category.id, isActive: true, isDiscounted },
    order,
    limit,
    offset,
    include: {
      model: Categories,
      as: "category",
    },
  });

  return res.status(200).send(products);
});
