const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.encryptString = async (sourceString) => {
  const salt = await bcrypt.genSalt(10);
  let encryptedString = await bcrypt.hash(sourceString, salt);
  return encryptedString;
};

exports.generateEmailAuthToken = async (email) => {
  const token = jwt.sign({ email }, process.env.NODE_SECRET_KEY);
  return token;
};

exports.generateAuthTokenWithObject = async (data) => {
  const token = jwt.sign(data, process.env.NODE_SECRET_KEY);
  return token;
};
exports.addAuthTokenInResponseHeader = async (data, resObject) => {
  let token = await this.generateAuthTokenWithObject(data);
  resObject.header("x-auth-token", token);
  resObject.header("Access-Control-Expose-Headers", "x-auth-token");
  return token;
};

exports.isValidUser = async (requestPassword, encryptedPassword) => {
  let isValidPassword = await bcrypt.compare(
    requestPassword,
    encryptedPassword
  );
  return isValidPassword;
};
