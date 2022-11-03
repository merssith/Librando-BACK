const Sequelize = require("sequelize");
const db = require("../config/db");

class Status extends Sequelize.Model {}

Status.init(
  {
    name: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "status",
  }
);

module.exports = Status;