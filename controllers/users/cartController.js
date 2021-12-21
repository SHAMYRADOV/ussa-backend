const catchAsync = require("../../utils/catchAsync");
const { Products } = require("../../models");
const AppError = require("../../utils/appError");

exports.getMyCart = catchAsync(async (req, res, next) => {
  const { carts } = req.body;
  var updated_carts = [];

  for (var i = 0; i < carts.length; i++) {
    const product = await Products.findOne({
      where: { uuid: carts[i].uuid },
    });

    if (!product) {
      return next(
        new AppError(`Product did not found with your ID index: ${i + 1}`, 400)
      );
    }

    if (product.stock_quantity > 0) {
      var quantity;
      if (product.stock_quantity > carts[i].quantity)
        quantity = carts[i].quantity;
      else quantity = product.stock_quantity;

      updated_carts.push({
        uuid: carts[i].uuid,
        quantity: quantity,
      });
    }
  }

  return res.status(200).send(updated_carts);
});
