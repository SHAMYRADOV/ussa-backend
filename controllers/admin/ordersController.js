const { Op, where } = require("sequelize");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const { Users, Orders, Products, Orderproducts } = require("../../models");

exports.getAllOrders = catchAsync(async (req, res, next) => {
  let { limit, offset, id, user_phone, status } = req.query;
  var where = {};
  if (status) where.status = status;
  if (user_phone) where.user_phone = user_phone;

  const orders = await Orders.findAll({
    where,
    order: [["id", "DESC"]],
    include: {
      model: Users,
      as: "user",
    },
    limit,
    offset,
  });

  return res.status(200).send(orders);
});

exports.getOrderProducts = catchAsync(async (req, res, next) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset;

  const order = await Orders.findOne({
    where: { uuid: req.params.id },
    include: {
      model: Orderproducts,
      as: "order_products",
    },
    limit,
    offset,
  });

  if (!order) return next(new AppError(`Order not found`, 404));

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
      stock_quantity,
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
      stock_quantity,
      quantity: order.order_products[i].quantity,
      product_price: order.order_products[i].price,
      total_price: order.order_products[i].total_price,
    };

    orderProducts.push(obj);
  }

  res.status(200).send(orderProducts);
});

exports.changeOrderStatus = catchAsync(async (req, res, next) => {
  const order = await Orders.findOne({
    where: { uuid: req.params.id },
    include: {
      model: Orderproducts,
      as: "order_products",
    },
  });

  if (!order) {
    return next(new AppError("Order did not found with that ID", 404));
  }

  if (order.status == "pending") {
    for (var i = 0; i < order.order_products.length; i++) {
      const product = await Products.findOne({
        where: {
          id: order.order_products[i].productId,
          stock_quantity: { [Op.gte]: order.order_products[i].quantity },
        },
      });
      if (!product) return next(new AppError("Product  not found/enough", 404));

      await product.update({
        stock_quantity:
          product.stock_quantity - order.order_products[i].quantity,
      });
    }
  }

  await order.update({
    status: req.body.status,
  });

  return res.status(201).send(order);
});

exports.deleteOrderProduct = catchAsync(async (req, res, next) => {
  const orderproduct = await Orderproducts.findOne({
    where: { uuid: req.params.id },
  });

  if (!orderproduct) {
    return next(new AppError("Order Product did not found with that ID", 404));
  }

  const order = await Orders.findOne({ where: { id: orderproduct.orderId } });

  await order.update({
    total_price: order.total_price - orderproduct.total_price,
  });

  await orderproduct.destroy();

  return res.status(200).json({ msg: "Successfully Deleted" });
});
