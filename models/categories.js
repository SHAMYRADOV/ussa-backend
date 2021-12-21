"use strict";
const { Model, UUIDV4 } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    static associate({ Products, Categories }) {
      this.hasMany(Products, {
        foreignKey: "categoryId",
        as: "category_products",
      });
      this.hasMany(Categories, {
        foreignKey: "parentId",
        as: "subcategories",
      });
    }
  }
  Categories.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
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
      image: {
        type: DataTypes.STRING,
      },
      parentId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      tableName: "categories",
      modelName: "Categories",
    }
  );
  return Categories;
};
