"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    static associate({ Categories }) {
      this.belongsTo(Categories, {
        foreignKey: "categoryId",
        as: "category",
      });
    }
  }
  Products.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      code: {
        type: DataTypes.STRING,
      },
      name_tm: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      name_ru: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description_tm: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description_ru: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      isDiscounted: {
        type: DataTypes.BOOLEAN,
      },
      price: {
        type: DataTypes.REAL,
      },
      discounted_price: {
        type: DataTypes.REAL,
      },
      new_price: {
        type: DataTypes.REAL,
      },
      image: {
        type: DataTypes.STRING,
      },
      preview_image: {
        type: DataTypes.STRING,
      },
      isNew: {
        type: DataTypes.BOOLEAN,
      },
      isPopular: {
        type: DataTypes.BOOLEAN,
      },
      stock_quantity: {
        type: DataTypes.INTEGER,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
      },
      categoryId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      tableName: "products",
      modelName: "Products",
    }
  );
  return Products;
};
