const jwt = require("jsonwebtoken");
const HttpCodes = require("../constants/httpCodes");
const AppMessages = require("../constants/appMessages");
const ErrorResponse = require("../composer/error-response");
const userService = require("../services/database/userService");
const getRole = require("../utils/general");

exports.auth = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res
      .status(HttpCodes.FORBIDDEN)
      .send(new ErrorResponse(AppMessages.APP_ACCESS_DENIED));
  }
  try {
    const decoded = jwt.verify(token, process.env.NODE_SECRET_KEY);
    req.user = decoded;
    const user = await userService.getUserByEmail(req.user.email);
    if (!user) {
      return res
        .status(HttpCodes.FORBIDDEN)
        .send(new ErrorResponse(AppMessages.INVALID_USER_CREDENTIALS));
    }
    next();
  } catch (error) {
    return res
      .status(HttpCodes.FORBIDDEN)
      .send(new ErrorResponse(AppMessages.APP_ACCESS_DENIED));
  }
};
exports.authEmail = (req, res, next) => {
  const token = req.headers['x-auth-token'];

  if (!token) {
    return res
      .status(HttpCodes.FORBIDDEN)
      .send(new ErrorResponse(AppMessages.APP_ACCESS_DENIED));
  }
  try {
    const decoded = jwt.verify(token, process.env.NODE_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {

    return res
      .status(HttpCodes.FORBIDDEN)
      .send(new ErrorResponse(AppMessages.APP_ACCESS_DENIED));
  }
};
