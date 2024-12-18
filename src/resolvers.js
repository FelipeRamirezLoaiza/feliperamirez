import { getUsers } from "./users/Query.js";
import { getProducts } from "./products/Query.js";
import { getCategories } from "./categories/Query.js";
import { getOrders } from "./orders/Query.js";
import { createUser, updateUser, deleteUser } from "./users/Query.js";
import { createProduct, updateProduct, deleteProduct } from "./products/Query.js";

export const resolvers ={
  Query: {
    getUsers,
    getProducts,
    getCategories,
    getOrders
  },

  Mutation: {
    createUser,
    updateUser,
    deleteUser,
    createProduct,
    updateProduct,
    deleteProduct
  }
};

