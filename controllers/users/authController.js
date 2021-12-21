const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const { Users } = require("../../models");
const { createSendToken } = require("./../../utils/createSendToken");

exports.signup = catchAsync(async (req, res, next) => {
  const { full_name, phone_number, city, address, password } = req.body;

  const newUser = await Users.create(req.body);

  createSendToken(newUser, 201, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  const {
    headers: { authorization },
  } = req;
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You are not logged as an User", 401));
  }

  const decoded = await promisify(jwt.verify)(token, "kerim");

  const freshUser = await Users.findOne({ where: { uuid: [decoded.id] } });

  if (!freshUser) {
    return next(
      new AppError("The user belonging to this token is no longer exists", 401)
    );
  }

  req.user = freshUser;
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { phone_number, newPassword } = req.body;

  const user = await Users.findOne({ where: { phone_number } });

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  createSendToken(user, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { phone_number, password } = req.body;

  if (!phone_number || !password) {
    return next(new AppError("Please provide phone_number and password", 400));
  }

  const user = await Users.findOne({ where: { phone_number } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Incorrect phone number or password", 401));
  }
  createSendToken(user, 200, res);
});
