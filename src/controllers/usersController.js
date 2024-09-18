const { adapterRequest } = require("../helpers/adapterRequest");
const userService = require("../services/database/userService");
const sendEmail = require("./../utils/sendEmail");
const authHelper = require("../helpers/authHelper");
const HttpCodes = require("../constants/httpCodes");
const AppMessages = require("../constants/appMessages");
const SuccessResponse = require("../composer/success-response");
const ErrorResponse = require("../composer/error-response");
const composeLink = require("../helpers/composeLink");
const catchAsync = require("../utils/catchAysnc");
const jwt = require("jsonwebtoken");

exports.createUser = catchAsync(async (req, res) => {
  let httpRequest = adapterRequest(req);
  let { body } = httpRequest;
  body.password = await authHelper.encryptString(body.password);
  await userService.createUserAccount(body);
  let link = await composeLink(body.email);
  await sendEmail(body.email, link);
  return res
    .status(HttpCodes.OK)
    .send(
      new SuccessResponse(
        AppMessages.SUCCESS,
        AppMessages.USER_SUCCESSFULY_REGISTERED
      )
    );
});

exports.verifyEmailAddress = catchAsync(async (req, res) => {
  console.log(req.user.email)
  let userEmail = req.user.email;

  let user = await userService.getUserByEmail(userEmail);
  if (!user) {
    throw new ErrorResponse(HttpCodes.BAD_REQUEST, AppMessages.USER_NOT_FOUND);
  } else {
    if (user.is_verified) {
      return res
        .status(HttpCodes.OK)
        .send(
          new SuccessResponse(
            AppMessages.SUCCESS,
            AppMessages.USER_ALREADY_VERIFIED
          )
        );
    }

    await userService.verifyUser(userEmail);
    return res
      .status(HttpCodes.OK)
      .send(
        new SuccessResponse(
          AppMessages.SUCCESS,
          AppMessages.USER_SUCCESSFULY_VERIFIED
        )
      );
  }
});

exports.loginUser = catchAsync(async (req, res) => {
    let httpRequest = adapterRequest(req);
    let { body } = httpRequest;
    let user = await userService.getUserByEmail(body.email);

    if (!user) {
        throw new ErrorResponse(
        HttpCodes.BAD_REQUEST,
        AppMessages.INVALID_USER_CREDENTIALS
        );
    }
    const isValidPassword= await authHelper.isValidUser(body.password, user.password);
    let roleType="";
    if(isValidPassword){
        if ( user.role_id === 1){
            roleType = "Admin";
        } else {
            roleType = "User";
        }
        const token = await authHelper.addAuthTokenInResponseHeader(
          {
            email: user.email,
            id: user.id,
            role_id: user.role_id,
            gender_id: user.gender_id,
            role: roleType
          }, res
        );
        return res.status(HttpCodes.OK).json({
            User_details: {
            name: user.name,
            email: user.email,
            id: user.id,
            role_id: user.role_id,
            gender_id: user.gender_id,
            dob: user.dob,
            role: roleType,
        },
        Message: new SuccessResponse(
            AppMessages.SUCCESS,
            AppMessages.USER_SUCCESSFULY_LOGEDIN
            ),
        });
    } else {
        return res.status(HttpCodes.FORBIDDEN).json({
        Message: new ErrorResponse(
            AppMessages.FORBIDDEN,
            AppMessages.APP_ERROR_MSG_INVALID_USERNAME_PASSWORD
        ),
        });
    }
});

exports.deleteUser = catchAsync(async (req, res) => {
  let email = req.body.email;
  let user = await userService.getUserByEmail(email);
    if (!user ) {
      throw new ErrorResponse(
        HttpCodes.BAD_REQUEST,
        AppMessages.APP_RESOURCE_NOT_FOUND
      );
    } else {
      await userService.deleteUser(email);
      return res.status(HttpCodes.OK).json({
        Message: new SuccessResponse(
          AppMessages.SUCCESS,
          AppMessages.USER_SUCCESSFULY_DELETED
        ),
      });
    }
});

exports.getUserDetails = catchAsync(async (req, res) => {
  let user;
  if (req.user.role_id == "0" && req.body?.id) {
    user = await userService.getUser(req.body.id);
    if (!user) {
      throw new ErrorResponse(
        HttpCodes.NOT_FOUND,
        AppMessages.APP_RESOURCE_NOT_FOUND
      );
    }
  } else {
    return res.status(HttpCodes.FORBIDDEN).json({
      Message: new ErrorResponse(
        AppMessages.FORBIDDEN,
          AppMessages.APP_ACCESS_DENIED
      ),
      });
  }
  //Api Call and Compose Response Response
  return res
    .status(HttpCodes.OK)
    .send(new SuccessResponse(AppMessages.SUCCESS, user));
});

exports.updateUser = catchAsync(async (req, res) => {
  let httpRequest = adapterRequest(req);
  let { body } = httpRequest;
    await userService.updateUser(body);
    return res
      .status(HttpCodes.OK)
      .send(
        new SuccessResponse(
          AppMessages.SUCCESS,
          AppMessages.USER_SUCCESSFULY_UPDATED
        )
      );
});

exports.listAllUsers = catchAsync(async(req, res) => {
  let users = await userService.getAllUsers()
  //Api Call and Compose Response Response
  return res
    .status(HttpCodes.OK)
    .send(new SuccessResponse(AppMessages.SUCCESS, users));
});