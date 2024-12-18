import { prisma } from "../database.js";
import ORDER_ERROR from "../orders/errors/OrdersErrors.json" assert { type: 'json' };
import ORDER_SUCCESS from "../orders/success/OrdersSuccess.json" assert { type: 'json' };

async function getOrders(parent, args, context, info) {
  let orders = null;

  try {
    orders = await prisma.order.findMany({
      include: {
        user: true,
      },
    });
  } catch (err) {
    throw new CustomError(ORDER_ERROR, OrderNotFound, err);
  }

  if (!orders || orders.length === 0) {
    throw new CustomError(
      ORDER_ERROR,
      OrderNotFound,
      "Error: Cannot return null for non-nullable field Query.getOrders"
    );
  }

  return {
    data: orders,
    msg: ORDER_SUCCESS.OrdersFound,
  };
}

async function createOrder(parent, { userId, total }, context, info) {
  let order = null;

  try {
    order = await prisma.order.create({
      data: {
        userId,
        total,
        date: new Date().toISOString(),
      },
    });
  } catch (err) {
    throw new CustomError(ORDER_ERROR, OrderNotFound, err);
  }

  return order;
}

async function updateOrder(parent, { id, total }, context, info) {
  let updatedOrder = null;

  try {
    updatedOrder = await prisma.order.update({
      where: { id },
      data: { total },
    });
  } catch (err) {
    throw new CustomError(ORDER_ERROR, OrderNotFound, err);
  }

  return updatedOrder;
}

async function deleteOrder(parent, { id }, context, info) {
  let deletedOrder = null;

  try {
    deletedOrder = await prisma.order.delete({
      where: { id },
    });
  } catch (err) {
    throw new CustomError(ORDER_ERROR, OrderNotFound, err);
  }

  return deletedOrder ? true : false;
}

export { getOrders, createOrder, updateOrder, deleteOrder };
