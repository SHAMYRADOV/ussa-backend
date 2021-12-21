"use strict";
const bcrypt = require("bcryptjs");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate({ Orders }) {
      this.hasMany(Orders, {
        foreignKey: "userId",
        as: "user_orders",
      });
    }
    toJSON() {
      return {
        ...this.get(),
        password: undefined,
      };
    }
  }
  Users.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      full_name: {
        type: DataTypes.STRING,
      },
      phone_number: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: "users",
      modelName: "Users",
    }
  );

  Users.beforeCreate(async (user, options) => {
    if (user.password) user.password = await bcrypt.hash(user.password, 12);
  });

  return Users;
};
