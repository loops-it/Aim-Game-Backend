const { validationException } = require("../exception");
const userService = require("../services/UserService");
const { validationRules } = require("../helper/validationHelper");

const validate = global.validate;

exports.getAllUsers = async (req, res, next) => {
  try {
    const data = await userService.getAllUsers();
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new validationException("id is required");
    }
    const data = await userService.getUserById(id);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.getUserDetailsByUserIdAndWorkspaceId = async (req, res, next) => {
  try {
    const userId = req.params.id; // Assuming the user ID is passed in the request parameters
    const workspaceId = req.params.workspaceId; // Assuming the workspace ID is passed in the request parameters

    const userDetails = await userService.getUserDetailsByUserIdAndWorkspaceId(
      userId,
      workspaceId
    );

    res.status(200).json({ success: true, status: 200, data: userDetails });
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    await validate(validationRules.createUser, req);
    const data = await userService.createUser(req.body);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};



exports.updateUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    await validate(validationRules.updateUser, req);
    const data = await userService.updateUser(id, req.body);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await userService.deleteUser(id);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.getAllWorkspacesByUser = async (req, res, next) => {
  const { userId } = req.user;
  try {
    const data = await userService.getAllWorkspacesByUser(userId);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.getMyWorkspaceUserDetails = async (req, res, next) => {
  const { userId } = req.user;
  try {
    const workspaceId = req.params.workspaceId; // Assuming the workspace ID is passed in the request parameters

    const userDetails = await userService.getUserDetailsByUserIdAndWorkspaceId(
      userId,
      workspaceId
    );

    res.status(200).json({ success: true, status: 200, data: userDetails });
  } catch (error) {
    next(error);
  }


};
