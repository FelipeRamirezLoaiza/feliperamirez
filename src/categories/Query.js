import { prisma } from "../database.js";
import CATEGORY_ERROR from "../categories/errors/CategoriesErrors.json" assert { type: 'json' };
import CATEGORY_SUCCESS from "../categories/success/CategoriesSuccess.json" assert { type: 'json' };

async function getCategories(parent, args, context, info) {
  let categories = null;

  try {
    categories = await prisma.category.findMany({
      include: {
        products: true,
      },
    });
  } catch (err) {
    throw new CustomError(CATEGORY_ERROR, CategoryNotFound, err);
  }

  if (!categories || categories.length === 0) {
    throw new CustomError(
      CATEGORY_ERROR,
      CategoryNotFound,
      "Error: Cannot return null for non-nullable field Query.getCategories"
    );
  }

  return {
    data: categories,
    msg: CATEGORY_SUCCESS.CategoriesFound,
  };
}

async function createCategory(parent, { name, description }, context, info) {
  let category = null;

  try {
    category = await prisma.category.create({
      data: {
        name,
        description,
      },
    });
  } catch (err) {
    throw new CustomError(CATEGORY_ERROR, CategoryNotFound, err);
  }

  return category;
}

async function updateCategory(parent, { id, name, description }, context, info) {
  let updatedCategory = null;

  try {
    updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, description },
    });
  } catch (err) {
    throw new CustomError(CATEGORY_ERROR, CategoryNotFound, err);
  }

  return updatedCategory;
}

async function deleteCategory(parent, { id }, context, info) {
  let deletedCategory = null;

  try {
    deletedCategory = await prisma.category.delete({
      where: { id },
    });
  } catch (err) {
    throw new CustomError(CATEGORY_ERROR, CategoryNotFound, err);
  }

  return deletedCategory ? true : false;
}

export { getCategories, createCategory, updateCategory, deleteCategory };
