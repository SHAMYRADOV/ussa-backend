"use strict";

const uuid = require("uuid");
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.bulkInsert("products", [
      {
        uuid: uuid.v4(),
        name_tm: "product-1",
        name_ru: "product-1",
        description_tm: "product description-1",
        description_ru: "product description-1",
        price: 250,
        stock_quantity: 50,
        isActive: true,
        categoryId: 2,
        createdAt: DataTypes.fn("now"),
        updatedAt: DataTypes.fn("now"),
      },
      {
        uuid: uuid.v4(),
        name_tm: "product-2",
        name_ru: "product-2",
        description_tm: "product description-2",
        description_ru: "product description-2",
        price: 200,
        discounted_price: 60,
        stock_quantity: 25,
        isActive: true,
        isDiscounted: true,
        categoryId: 2,
        createdAt: DataTypes.fn("now"),
        updatedAt: DataTypes.fn("now"),
      },
      {
        uuid: uuid.v4(),
        name_tm: "product-3",
        name_ru: "product-3",
        description_tm: "product description-3",
        description_ru: "product description-3",
        price: 150,
        stock_quantity: 40,
        isActive: true,
        categoryId: 3,
        createdAt: DataTypes.fn("now"),
        updatedAt: DataTypes.fn("now"),
      },
      {
        uuid: uuid.v4(),
        name_tm: "product-4",
        name_ru: "product-4",
        description_tm: "product description-4",
        description_ru: "product description-4",
        price: 100,
        discounted_price: 25,
        stock_quantity: 20,
        isActive: true,
        isDiscounted: true,
        categoryId: 3,
        createdAt: DataTypes.fn("now"),
        updatedAt: DataTypes.fn("now"),
      },
    ]);
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.bulkDelete("products", null, {});
  },
};
