const { validationException } = require("../exception");
const { createToken } = require("../middleware/authMiddleware");
const authService = require("../services/AuthService");
const Joi = require("joi");

exports.login = async (req, res, next) => {
  const { body } = req;
  const loginValidationRules = {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  };
  try {
    const { error } = await validate(loginValidationRules, req);
    if (error) {
      throw new validationException(error.message);
    }

    const data = await createToken(body);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.selectWorkspace = async (req, res, next) => {
  const { body } = req;
  const loginValidationRules = {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    workspaceId: Joi.string().required(),
  };
  try {
    const { error } = await validate(loginValidationRules, req);
    if (error) {
      throw new validationException(error.message);
    }
    const data = await authService.selectWorkspace(body);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

exports.forgetPassword = async (req, res, next) => {
  const { body } = req;
  const loginValidationRules = {
    email: Joi.string().email().required(),
  };
  try {
    const { error } = await validate(loginValidationRules, req);
    if (error) {
      throw new validationException(error.message);
    }
    const data = await authService.forgetPassword(body);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};
exports.verifyUser = async (req, res, next) => {
console.log("verifyUser Con Running");
  try {
    const data = await authService.verifyUser(req.body);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};
exports.resetPassword = async (req, res, next) => {
  const { body } = req;
  const loginValidationRules = {
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
    password: Joi.string().required(),
  };
  try {
    const { error } = await validate(loginValidationRules, req);
    if (error) {
      throw new validationException(error.message);
    }
    const data = await authService.resetPassword(body);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};
