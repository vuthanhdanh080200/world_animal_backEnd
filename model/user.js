const { createMssqlRequest } = require("../utility/sqlHelper");
const sql = require("mssql");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

class User {
  static async create(user) {
    const { error } = validateUser(user);
    if (error) throw new Error(error);

    const request = await createMssqlRequest();
    const result = await request
      .input("Username", sql.NVarChar(50), user.username)
      .input("Email", sql.NVarChar(50), user.email)
      .input("Password", sql.NVarChar(50), user.password)
      .input("Avatar", sql.NVarChar(sql.MAX), user.avatar)
      .execute("[dbo].[spCreateUser]");

    return result.recordset[0];
  }

  static async update(user) {
    const request = await createMssqlRequest();
    const result = await request
      .input("UserId", sql.NVarChar(50), user.userId)
      .input("Username", sql.NVarChar(50), user.username)
      .input("Email", sql.NVarChar(50), user.email)
      .input("Password", sql.NVarChar(50), user.password)
      .input("Avatar", sql.NVarChar(sql.MAX), user.avatar)
      .execute("[dbo].[spUpdateUserById]");

    return result.recordset[0];
  }

  static async delete(userId) {
    const request = await createMssqlRequest();
    const result = await request
      .input("UserId", sql.NVarChar(50), userId)
      .execute("[dbo].[spDeleteUserById]");

    if (result.rowsAffected[0] !== 1) {
      return false;
    }
    return true;
  }

  static async getUserByUsername(username) {
    const request = await createMssqlRequest();
    const result = await request
      .input("Username", sql.NVarChar(50), username)
      .execute("[dbo].[spGetUserByUsername]");
    return result.recordset[0];
  }

  static async getUserById(userId) {
    const request = await createMssqlRequest();
    const result = await request
      .input("UserId", sql.NVarChar(50), userId)
      .execute("[dbo].[spGetUserById]");
    return result.recordset[0];
  }

  static generateAuthToken(user) {
    delete user.image;
    const token = jwt.sign(user, config.get("jwtPrivateKey"));
    return token;
  }
}

const validateUser = (user) => {
  const schema = Joi.object({
    userId: Joi.any(),
    username: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(50).email().required(),
    password: Joi.string().min(5).required(),
    avatar: Joi.any(),
  });

  return schema.validate(user);
};
module.exports.validate = validateUser;
module.exports.User = User;
