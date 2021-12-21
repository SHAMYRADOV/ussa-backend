"use strict";

const { DataTypes } = require("sequelize/dist");

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
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
      image_isAdded: {
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable("products");
  },
};
