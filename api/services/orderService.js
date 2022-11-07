const { async } = require("seed/lib/seed");
const {
  User,
  Order,
  BookOrder,
  Book,
  Status,
  PaymentMethod,
} = require("../models");

exports.findAll = async () => {
  let orders = await Order.findAll({
    include: [
      {
        model: BookOrder,
        required: false,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
    attributes: { exclude: ["bookOrderId"] },
  });
  await getAditionalInformation(orders);
  return orders;
};

exports.create = (order) => {
  return Order.create(order);
};

exports.ordersByUser = async (id) => {
  let user = await User.findOne({ where: { id } });
  let orders = await Order.findAll({ where: { userId: user.id } });
  return orders;
};

exports.changeOrder = async (id, body) => {
  let order = await Order.findByPk(id);
  order.update(body);
  return order;
};

async function getAditionalInformation(ordersArray) {
  await getUser(ordersArray);
  await getStatus(ordersArray);
  await getPayment(ordersArray);
  await getBooks(ordersArray);
  return ordersArray;
}

async function getPayment(ordersArray) {
  for (i = 0; i < ordersArray.length; i++) {
    let paymentId = ordersArray[i].statusId;
    let payment = await PaymentMethod.findByPk(paymentId, {
      attributes: { exclude: ["createdAt", "updatedAt", "orderId"] },
    });
    ordersArray[i].dataValues.payment = payment;
  }
}

async function getStatus(ordersArray) {
  for (i = 0; i < ordersArray.length; i++) {
    let statusId = ordersArray[i].statusId;
    let status = await Status.findByPk(statusId, {
      attributes: { exclude: ["createdAt", "updatedAt", "orderId"] },
    });
    ordersArray[i].dataValues.status = status;
  }
}

async function getUser(ordersArray) {
  for (i = 0; i < ordersArray.length; i++) {
    let userId = ordersArray[i].userId;
    let user = await User.findByPk(userId, {
      attributes: { exclude: ["createdAt", "updatedAt", "password", "salt"] },
    });
    ordersArray[i].dataValues.user = user;
  }
}

async function getBooks(ordersArray) {
  for (i = 0; i < ordersArray.length; i++) {
    let bookOrders = ordersArray[i].book_orders;
    for (j = 0; j < bookOrders.length; j++) {
      let bookId = bookOrders[j].bookId;
      let findBook = await Book.findByPk(bookId, {
        attributes: { exclude: ["bookOrderId", "createdAt", "updatedAt"] },
      });
      bookOrders[j].dataValues.book = findBook;
    }
  }
}
