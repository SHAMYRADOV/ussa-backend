const { Products } = require("../../models");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");

exports.getMyFavorites = catchAsync(async (req, res, next) => {
  const { favorites } = req.body;
  let products = [];
  for (var i = 0; i < favorites.length; i++) {
    const product = await Products.findOne({
      where: { uuid: favorites[i].uuid },
    });
    if (!product) return next(new AppError("Product not found", 404));
    products.push(product);
  }

  return res.status(200).send(products);
});
