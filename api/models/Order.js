const Sequelize = require("sequelize");
const db = require("../config/db");

class Order extends Sequelize.Model {}

Order.init(
  {
    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    total: {
      type: Sequelize.FLOAT,
      allowNull: false,
    }
  },
  {
    sequelize: db,
    modelName: "order",
  }
);

module.exports = Order;
