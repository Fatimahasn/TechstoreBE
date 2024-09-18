const HttpCodes = require("../constants/httpCodes");
const AppMessages = require("../constants/appMessages");
const ErrorResponse = require("../composer/error-response");
const { getRole } = require("../utils/general");
// const { findRole } = require("../services/database/roleService");

exports.roleCheck = (roles = []) => {
  return async (req, res, next) => {
    const role_id = req.body?.role_id || req.user?.role_id;
    let userRole;
    try {
      userRole = getRole(role_id)
    } catch (err) {
      return res
        .status(HttpCodes.FORBIDDEN)
        .send(new ErrorResponse(err.message));
    }
    req.user.role = userRole;
    // const roleSet = new Set(roles);

    if (!userRole) {
      return res
        .status(HttpCodes.FORBIDDEN)
        .send(new ErrorResponse(AppMessages.APP_ACCESS_DENIED));
    }
    next();
  };
};
