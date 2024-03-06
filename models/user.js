"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      firstName: DataTypes.STRING,
    },
    {}
  );
  User.associate = function (models) {
    console.log("associations for", models);
  };
  return User;
};
