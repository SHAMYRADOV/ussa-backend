const Op = require("sequelize").Op;
const catchAsync = require("../../utils/catchAsync");
const { Users } = require("../../models");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset;

  const users = await Users.findAll({
    order: [["updatedAt", "DESC"]],
    limit,
    offset,
  });

  return res.status(200).send(users);
});

// Search
const capitalize = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

exports.searchUsers = catchAsync(async (req, res, next) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset;

  let users = [];
  let { keyword } = req.query;

  let keywordsArray = [];
  keyword = keyword.toLowerCase();
  keywordsArray.push("%" + keyword + "%");
  keyword = "%" + capitalize(keyword) + "%";
  keywordsArray.push(keyword);

  users = await Users.findAll({
    where: {
      [Op.or]: [
        {
          phone_number: {
            [Op.like]: {
              [Op.any]: keywordsArray,
            },
          },
        },
        {
          full_name: {
            [Op.like]: {
              [Op.any]: keywordsArray,
            },
          },
        },
      ],
    },
    limit,
    offset,
  });

  return res.status(200).send(users);
});
