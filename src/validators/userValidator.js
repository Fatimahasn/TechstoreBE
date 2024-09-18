const Joi = require("joi");
const HttpCodes = require("../constants/httpCodes");
const ErrorResponse = require("../composer/error-response");

let validateCreateUser = async (req, res, next) => {
  let { body } = req;
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().max(255).required(),
    gender_id: Joi.number().required(),
    role_id: Joi.number().required(),
    dob: Joi.date().iso().required(),
    is_active: Joi.boolean().required(),
    is_verified: Joi.boolean().required(),
  });

  try {
    req.body.is_active = true;
    req.body.is_verified = false;
    await schema.validateAsync(body);
    next();
  } catch (error) {
    return res.status(HttpCodes.FORBIDDEN).json({
      error: error.message,
    });
  }
};

let validateChangePassword = async (req, res, next) => {
  let { body } = req;

  const schema = Joi.object({
    id: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  });

  try {
    await schema.validateAsync(body);
    next();
  } catch (error) {
    return res.status(HttpCodes.FORBIDDEN).json({
      error: error.message,
    });
  }
};

let validateUserLogin = async (req, res, next) => {
  let { body } = req;
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().max(255).required(),
  });

  try {
    await schema.validateAsync(body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(HttpCodes.FORBIDDEN).json({
      error: error.message,
    });
  }
};

let validateUpdateUser = async (req, res, next) => {
  let body = req.body;
  const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().max(255).required(),
    gender_id: Joi.number().required(),
    dob: Joi.date().iso().required(),
  });
  try {
    await schema.validateAsync(body);
    next();
  } catch (error) {
    console.error(error);
    return res.status(HttpCodes.FORBIDDEN).json({
      error: error.message,
    });
  }
};


let userValidator = {
  validateCreateUser,
  validateUpdateUser,
  validateUserLogin,
  validateChangePassword,
};


module.exports = userValidator;
