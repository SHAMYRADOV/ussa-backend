"use strict";

const uuid = require("uuid");
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.bulkInsert("cities", [
      {
        uuid: uuid.v4(),
        name_tm: "Ashgabat",
        name_ru: "Ашгабат",
        createdAt: DataTypes.fn("now"),
        updatedAt: DataTypes.fn("now"),
      },
      {
        uuid: uuid.v4(),
        name_tm: "Anew",
        name_ru: "Анев",
        createdAt: DataTypes.fn("now"),
        updatedAt: DataTypes.fn("now"),
      },
      {
        uuid: uuid.v4(),
        name_tm: "Buzmeyin",
        name_ru: "Бузмейин",
        createdAt: DataTypes.fn("now"),
        updatedAt: DataTypes.fn("now"),
      },
    ]);
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.bulkDelete("cities", null, {});
  },
};
