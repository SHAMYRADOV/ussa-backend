"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Orderproducts extends Model {
    static associate({ Orders }) {
      this.belongsTo(Orders, {
        foreignKey: "orderId",
        as: "order",
      });
    }
  }
  Orderproducts.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      price: {
        type: DataTypes.REAL,
      },
      quantity: {
        type: DataTypes.REAL,
        allowNull: false,
      },
      total_price: {
        type: DataTypes.REAL,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "orderproducts",
      modelName: "Orderproducts",
    }
  );
  return Orderproducts;
};
