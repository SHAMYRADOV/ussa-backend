"use strict";

const uuid = require("uuid");
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.bulkInsert("categories", [
      {
        uuid: uuid.v4(),
        name_tm: "category-1",
        name_ru: "category-1",
        createdAt: DataTypes.fn("now"),
        updatedAt: DataTypes.fn("now"),
      },
      {
        uuid: uuid.v4(),
        name_tm: "category-2",
        name_ru: "category-2",
        createdAt: DataTypes.fn("now"),
        updatedAt: DataTypes.fn("now"),
      },
      {
        uuid: uuid.v4(),
        name_tm: "category-1.1",
        name_ru: "category-1.1",
        parentId: 1,
        createdAt: DataTypes.fn("now"),
        updatedAt: DataTypes.fn("now"),
      },
    ]);
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
