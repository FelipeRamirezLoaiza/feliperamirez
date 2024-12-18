import { prisma } from "../database.js";
import USER_ERROR from "../users/errors/UsersErrors.json" assert { type: 'json' };
import USER_SUCCESS from "../users/success/UsersSuccess.json" assert { type: 'json' };

/**
 * Get all users with their profiles and orders.
 * @param {Object} parent - GraphQL parent object data.
 * @param {Object} args - GraphQL arguments.
 * @param {Object} context - Apollo Context Data.
 * @param {Object} info - GraphQL Info Data.
 * @return {Array} Return a list of users.
 */
async function getUsers(parent, args, context, info) {
  let users = null;
  
  try {
    users = await prisma.user.findMany({
      include: {
        profile: true,
        orders: true
      }
    });
  } catch (err) {
    throw new CustomError(USER_ERROR, "UsersNotFound", err);
  }

  if (!users || users.length === 0) {
    throw new CustomError(
      USER_ERROR,
      "UsersNotFound",
      "Error: Cannot return null for non-nullable field Query.getUsers"
    );
  }

  return {
    data: users,
    msg: USER_SUCCESS.UsersFound,
  };
}

/**
 * Create a new user.
 * @param {Object} parent - GraphQL parent object data.
 * @param {Object} args - GraphQL arguments (email, password).
 * @param {String} args.email - User's email.
 * @param {String} args.password - User's password.
 * @param {Object} context - Apollo Context Data.
 * @param {Object} info - GraphQL Info Data.
 * @return {Object} Return the created user object.
 */
async function createUser(parent, { email, password }, context, info) {

  if (!validateEmail(email)) {
    throw new CustomError(USER_ERROR, "InvalidEmail", "Invalid email format");
  }

  if (!validatePassword(password)) {
    throw new CustomError(USER_ERROR, "WeakPassword", "Password is too weak");
  }
  
  let user = null;

  try {
    user = await prisma.user.create({
      data: {
        email,
        password,  // Ensure password is encrypted before saving.
        role: "CLIENT" // Default value is "CLIENT".
      },
    });
  } catch (err) {
    throw new CustomError(USER_ERROR, "ArgumentsAreMissing", err);
  }

  return user;
}

/**
 * Update user details.
 * @param {Object} parent - GraphQL parent object data.
 * @param {Object} args - GraphQL arguments (id, email, password, role).
 * @param {Int} args.id - User ID.
 * @param {String} args.email - Updated email.
 * @param {String} args.password - Updated password.
 * @param {String} args.role - Updated user role.
 * @param {Object} context - Apollo Context Data.
 * @param {Object} info - GraphQL Info Data.
 * @return {Object} Return the updated user object.
 */
async function updateUser(parent, { id, email, password, role }, context, info) {
  let updatedUser = null;

  try {
    updatedUser = await prisma.user.update({
      where: { id },
      data: { email, password, role },
    });
  } catch (err) {
    throw new CustomError(USER_ERROR, "UserNotFound", err);
  }

  return updatedUser;
}

/**
 * Delete a user by ID.
 * @param {Object} parent - GraphQL parent object data.
 * @param {Object} args - GraphQL arguments (id).
 * @param {Int} args.id - User ID to delete.
 * @param {Object} context - Apollo Context Data.
 * @param {Object} info - GraphQL Info Data.
 * @return {Boolean} Return true if deleted, else false.
 */
async function deleteUser(parent, { id }, context, info) {
  let deletedUser = null;

  try {
    deletedUser = await prisma.user.delete({
      where: { id },
    });
  } catch (err) {
    throw new CustomError(USER_ERROR, "UserNotFound", err);
  }

  return deletedUser ? true : false;
}

export { getUsers, createUser, updateUser, deleteUser };

