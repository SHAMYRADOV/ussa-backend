const { Op } = require("sequelize");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const { Products, Orders, Orderproducts, Users } = require("../../models");

exports.addMyOrders = catchAsync(async (req, res, next) => {
  var { userId, user_address, products, user_name, user_phone } = req.body;
  let order_products = [],
    total_price = 0;

  for (prod of products) {
    const product = await Products.findOne({
      where: { uuid: prod.uuid, stock_quantity: { [Op.gte]: prod.quantity } },
    });
    if (!product) return next(new AppError("Something not found/enough", 404));
    order_products.push(product);
    if (product.discounted_price !== null) {
      total_price += product.discounted_price * prod.quantity;
    } else {
      total_price += product.price * prod.quantity;
    }
  }

  const user = await Users.findOne({
    where: { phone_number: user_phone },
  });
  userId = user.id;
  const order = await Orders.create({
    userId,
    total_price,
    user_address,
    user_name,
    user_phone,
  });

  for (var i = 0; i < order_products.length; i++) {
    if (order_products[i].discounted_price !== null) {
      await Orderproducts.create({
        orderId: order.id,
        productId: order_products[i].id,
        quantity: products[i].quantity,
        price: order_products[i].discounted_price,
        total_price: order_products[i].discounted_price * products[i].quantity,
      });
    } else {
      await Orderproducts.create({
        orderId: order.id,
        productId: order_products[i].id,
        quantity: products[i].quantity,
        price: order_products[i].price,
        total_price: order_products[i].price * products[i].quantity,
      });
    }
  }

  return res.status(200).json({ status: "Ordered" });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const limit = req.query.limit || 20;
  const offet = req.query.offet;

  const orders = await Orders.findAll({
    where: { userId: req.user.id },
    order: [["updatedAt", "DESC"]],
    limit,
    offet,
  });

  res.status(200).send(orders);
});

exports.getMyOrderProducts = catchAsync(async (req, res, next) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset;

  const order = await Orders.findOne({
    where: { uuid: req.params.id },
    include: {
      model: Orderproducts,
      as: "order_products",
    },
    order: [["updatedAt", "DESC"]],
    limit,
    offset,
  });

  if (!order)
    return next(new AppError(`Order did not found with that ID`, 404));

  let orderProducts = [];

  for (var i = 0; i < order.order_products.length; i++) {
    const product = await Products.findOne({
      where: { id: order.order_products[i].productId },
    });
    if (!product)
      return next(
        new AppError(`Products did not found with your ID: ${i}`, 404)
      );

    const {
      uuid,
      code,
      name_tm,
      name_ru,
      description_tm,
      description_ru,
      preview_image,
      image,
    } = product;

    const obj = {
      uuid,
      code,
      name_tm,
      name_ru,
      description_tm,
      description_ru,
      preview_image,
      image,
      quantity: order.order_products[i].quantity,
      product_price: order.order_products[i].price,
      total_price: order.order_products[i].total_price,
    };

    orderProducts.push(obj);
  }

  res.status(200).send(orderProducts);
});
