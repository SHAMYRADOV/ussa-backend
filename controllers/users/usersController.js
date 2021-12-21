const bcrypt = require("bcryptjs");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const { Users } = require("../../models");
const { createSendToken } = require("../../utils/createSendToken");

exports.getMe = catchAsync(async (req, res) => {
  return res.status(200).send(req.user);
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const user = await Users.findOne({ where: { uuid: req.user.uuid } });
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword)
    return next(new AppError("You have to provide your current password", 400));

  if (newPassword.length < 6)
    return next(
      new AppError(
        "New Passwords are not the same or less than 6 characters",
        400
      )
    );

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError("Your current password is wrong", 401));
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  createSendToken(user, 200, res);
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const user = await Users.findOne({ where: { uuid: req.user.uuid } });

  var { full_name, city, address } = req.body;

  await user.update({ full_name, city, address });

  res.send(user);
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Users.destroy({ where: { phone_number: req.user.phone_number } });

  res.status(200).send(" Successfully Deleted");
});
