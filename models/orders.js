"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    static associate({ Users, Orderproducts }) {
      this.belongsTo(Users, {
        foreignKey: "userId",
        as: "user",
      });
      this.hasMany(Orderproducts, {
        foreignKey: "orderId",
        as: "order_products",
      });
    }
  }
  Orders.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      code: {
        type: DataTypes.STRING,
      },
      total_price: {
        type: DataTypes.REAL,
        allowNull: false,
      },
      user_address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      user_phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      tableName: "orders",
      modelName: "Orders",
    }
  );
  return Orders;
};
