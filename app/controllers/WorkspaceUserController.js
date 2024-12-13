const { validationException } = require("../exception");
const workspaceUserService = require("../services/WorkspaceUserService");
const Joi = require("joi");

exports.getAllWorkspaceUsers = async (req, res, next) => {
  try {
    const data = await workspaceUserService.getAllWorkspaceUsers();
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.getWorkspaceUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new validationException("id is required");
    }
    const data = await workspaceUserService.getWorkspaceUserById(id);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.createWorkspaceUser = async (req, res, next) => {
  const workspaceUserValidationRules = {
    role: Joi.string().required(),
    workspaceId: Joi.string().required(),
    designation: Joi.string().allow(null, ""),
  };

  const { body } = req;
  try {
    await validate(workspaceUserValidationRules, req);
    const userWorkspaceData = { ...body, userId: req.user.userId };
    const data = await workspaceUserService.createWorkspaceUser(
      userWorkspaceData
    );
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.getWorkspaceUsersByWorkspaceId = async (req, res, next) => {
  const { workspaceId } = req.params;
  try {
    if (!workspaceId) {
      throw new validationException("workspaceId is required");
    }
    const data = await workspaceUserService.getWorkspaceUsersByWorkspaceId(
      workspaceId
    );
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.updateWorkspaceUser = async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    if (!id) {
      throw new validationException("id is required");
    }
    // await validate(/* your update validation rules */, req);
    const updatedUser = await workspaceUserService.updateWorkspaceUser(
      id,
      updateData
    );

    res.status(200).json({ success: true, status: 200, data: updatedUser });
  } catch (error) {
    next(error);
  }
};

exports.deleteWorkspaceUserById = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!id) {
      throw new validationException("id is required");
    }

    await workspaceUserService.deleteWorkspaceUserById(id);

    res.status(204).json({
      success: true,
      status: 204,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getWorkspaceUserData = async (req, res, next) => {
  const { userId, workspaceId } = req.params;
  const userStruData = {
    _id: userId,
  };
  try {
    const data = await workspaceUserService.getWorkspaceUserData(userStruData);

    res.status(200).json({ success: true, status: 200, data: data });
  } catch (error) {
    next(error);
  }
};

exports.addUserToWorkspace = async (req, res, next) => {
  const workspaceUserValidationRules = {
    role: Joi.string().required(),
    userId: Joi.string().required(),
    designation: Joi.string().allow(null, ""),
  };

  const workspaceId = req.params.workspaceId;

  const { body } = req;
  try {
    await validate(workspaceUserValidationRules, req);
    const userWorkspaceData = { ...body, workspaceId };
    const data = await workspaceUserService.createWorkspaceUser(
      userWorkspaceData
    );
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.createUserAndAddToWorkspace = async (req, res, next) => {
  const workspaceUserNewValidationRules = {
    role: Joi.string().required(),
    workspaceId: Joi.string().required(),
    designation: Joi.string().allow(null, ""),
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().allow(null, ""),
  };
  const { workspaceId } = req.params;
  const { body } = req;
  const DataToValidate = { ...body, workspaceId };
  try {
    await validate(workspaceUserNewValidationRules, { body: DataToValidate });
    const user = {
      name: body.name,
      email: body.email,
      phone: body?.phone,
      password: "12345678",
    };
    const workspaceUser = {
      role: body.role,
      designation: body?.designation,
      workspaceId,
    };
    const data = await workspaceUserService.createUserAndAddToWorkspace(
      user,
      workspaceUser
    );
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};
