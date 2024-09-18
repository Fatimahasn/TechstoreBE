const ErrorResponse = require("../../composer/error-response");
const HttpCodes = require("../../constants/httpCodes");
const AppMessages = require("../../constants/appMessages");
const mysql = require("../../config/mysql");

exports.createUserAccount = async (body) => {
  let exists = await this.getUserByEmail(body.email);
  if (exists) {
    throw new ErrorResponse(
      HttpCodes.BAD_REQUEST,
      AppMessages.APP_DUPLICATE_RECORD
    );
  }
  let sql=`INSERT INTO user(name, email, password, gender_id, dob, role_id, is_verified) values (?,?,?,?,?,?,?)`
  let resp = await mysql.query(sql, [body.name, body.email, body.password, body.gender_id, body.dob, body.role_id, body.is_verified])
  return resp[0][0]?resp[0][0]:null;
};

exports.getUserByEmail = async (email) => {
  let sql = `SELECT * FROM user WHERE email = '${email}'`;
  let resp = await mysql.query(sql);
  return resp ? resp[0][0] : null;
};

exports.verifyUser = async (userEmail) => {
  let sql = `SELECT * FROM user WHERE email = '${userEmail}'`;
  let resp = await mysql.query(sql);
  return resp ? resp[0][0] : null;
};

exports.deleteUser = async (userEmail) => {
  let sql=`DELETE FROM user WHERE email = '${userEmail}'`;
  let resp = await mysql.query(sql);
  return resp ? resp[0][0] : null;
};

exports.updateUser = async (body) => {
  let user = await this.getUserByEmail(body.email);
  if (!user) {
    throw new ErrorResponse(
      HttpCodes.NOT_FOUND,
      AppMessages.APP_RESOURCE_NOT_FOUND
    );
  }
  if (user.is_active != true) {
    throw new ErrorResponse(
      HttpCodes.FORBIDDEN,
      AppMessages.DEACTIVATED_ACCOUNT
    );
  }
  if (user.is_verified != true) {
    throw new ErrorResponse(HttpCodes.FORBIDDEN, AppMessages.USER_NOT_VERIFIED);
  }
  let sql = `UPDATE user SET name= '${body.name}', gender_id= '${body.gender_id}', dob= '${body.dob}' WHERE email='${body.email}'`;
  let resp = await mysql.query(sql);
  return resp ? resp[0][0] : null;
};

exports.getUser = async (id) => {
  let sql = `SELECT * FROM user WHERE id = '${id}' AND is_active=1`;
  let resp = await mysql.query(sql);
  return resp ? resp[0][0] : null;
};

exports.getAllUsers = async () => {
  let sql = `SELECT user.name, user.email, user.dob, gender.type, user.role_id,user.is_verified
  FROM user
  INNER JOIN gender ON user.gender_id=gender.gender_id `;
  let resp = await mysql.query(sql);
  return resp ? resp[0] : null;
};