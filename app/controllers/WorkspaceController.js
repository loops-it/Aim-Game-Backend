const { validationException } = require("../exception");
const workspaceService = require("../services/WorkspaceService");
const Joi = require("joi");

exports.getAllWorkspaces = async (req, res, next) => {
  try {
    const data = await workspaceService.getAllWorkspaces();
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.getWorkspaceById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new validationException("id is required");
    }
    const data = await workspaceService.getWorkspaceById(id);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

// exports.createWorkspace = async (req, res, next) => {
//   const workspaceValidationRules = {
//     name: Joi.string().required(),
//     address: Joi.string().required(),
//     subscription: Joi.string().required(),
//     industryTypeId: Joi.string().required(),
//     contactEmail: Joi.string().email().required(),
//   };

//   const { body } = req;
//   try {
//     await validate(workspaceValidationRules, req);
//     const data = await workspaceService.createWorkspace(body);
//     res.status(201).json({ success: true, status: 201, data });
//   } catch (error) {
//     next(error);
//   }
// };
exports.createWorkspace = async (req, res, next) => {
  const workspaceValidationRules = {
    name: Joi.string().required(),
    refNo: Joi.string().required(),
  };

  const { body } = req;
  try {
    await validate(workspaceValidationRules, req);
    const data = await workspaceService.createWorkspace(body);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};
exports.getWorkspaceByUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new validationException("User ID is required");
    }
    const data = await workspaceService.getWorkspaceByUser(
      id
    );
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};
// exports.updateWorkspace = async (req, res, next) => {
//   const { id } = req.params;
//   const { body } = req;
//   const workspaceValidationRules = {
//     name: Joi.string(),
//     address: Joi.string(),
//     subscription: Joi.string(),
//     industryTypeId: Joi.string(),
//     contactEmail: Joi.string().email(),
//   };
//   try {
//     await validate(workspaceValidationRules, req);
//     const data = await workspaceService.updateWorkspace(id, body);
//     res.status(201).json({ success: true, status: 201, data });
//   } catch (error) {
//     next(error);
//   }
// };
exports.updateWorkspace = async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  const workspaceValidationRules = {
    name: Joi.string().required(),
    refNo: Joi.string().required(),
  };
  try {
    await validate(workspaceValidationRules, req);
    const data = await workspaceService.updateWorkspace(id, body);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};
exports.deleteWorkspace = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await workspaceService.deleteWorkspace(id);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.getWorkspaceByIndustryType = async (req, res, next) => {
  const { industryTypeId } = req.params;
  try {
    if (!industryTypeId) {
      throw new validationException("industryTypeId is required");
    }
    const data = await workspaceService.getWorkspaceByIndustryType(
      industryTypeId
    );
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.getWorkspaceBySubscription = async (req, res, next) => {
  const { subscription } = req.params;
  try {
    if (!subscription) {
      throw new validationException("subscription is required");
    }
    const data = await workspaceService.getWorkspaceBySubscription(
      subscription
    );
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.getWorkspaceByContactEmail = async (req, res, next) => {
  const { contactEmail } = req.params;
  try {
    if (!contactEmail) {
      throw new validationException("contactEmail is required");
    }
    const data = await workspaceService.getWorkspaceByContactEmail(
      contactEmail
    );
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};
