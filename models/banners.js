"use strict";
const { Model, UUIDV4 } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Banners extends Model {
    static associate(models) {}
  }
  Banners.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
      },
      image: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: "banners",
      modelName: "Banners",
    }
  );
  return Banners;
};
