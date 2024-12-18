import { prisma } from "../database.js";
import PRODUCT_ERROR from "../products/errors/ProductsErrors.json" assert { type: 'json' };
import PRODUCT_SUCCESS from "../products/success/ProductsSuccess.json" assert { type: 'json' };

async function getProducts(parent, args, context, info) {
  let products = null;

  try {
    products = await prisma.product.findMany({
      include: {
        details: true,
        categories: true,
      },
    });
  } catch (err) {
    throw new CustomError(PRODUCT_ERROR, ProductNotFound, err);
  }

  if (!products || products.length === 0) {
    throw new CustomError(
      PRODUCT_ERROR,
      ProductNotFound,
      "Error: Cannot return null for non-nullable field Query.getProducts"
    );
  }

  return {
    data: products,
    msg: PRODUCT_SUCCESS.ProductsFound,
  };
}

async function createProduct(parent, { name, price }, context, info) {

   if (!name || typeof price !== "number") {
    throw new Error("Invalid input: name and price are required.");
  }

  let product = null;

  try {
    product = await prisma.product.create({
      data: {
        name,
        price,
      },
    });
  } catch (err) {
    console.error("Error creating product:", err.message);
    throw new CustomError(PRODUCT_ERROR, ProductNotFound, err);
  }

  return product;
}

async function updateProduct(parent, { id, name, price }, context, info) {
  let updatedProduct = null;

  try {
    updatedProduct = await prisma.product.update({
      where: { id },
      data: { name, price },
    });
  } catch (err) {
    throw new CustomError(PRODUCT_ERROR, ProductNotFound, err);
  }

  return updatedProduct;
}

async function deleteProduct(parent, { id }, context, info) {
  let deletedProduct = null;

  try {
    deletedProduct = await prisma.product.delete({
      where: { id },
    });
  } catch (err) {
    throw new CustomError(PRODUCT_ERROR, ProductNotFound, err);
  }

  return deletedProduct ? true : false;
}

export { getProducts, createProduct, updateProduct, deleteProduct };


