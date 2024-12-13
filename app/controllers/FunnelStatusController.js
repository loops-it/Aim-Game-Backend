const { validationException } = require("../exception");
const funnelStatusService = require("../services/FunnelStatusService");
const Joi = require("joi");

exports.getAllFunnelStatuses = async (req, res, next) => {
  try {
    const data = await funnelStatusService.getAllFunnelStatuses();
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.getFunnelStatusById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new validationException("id is required");
    }
    const data = await funnelStatusService.getFunnelStatusById(id);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.createFunnelStatus = async (req, res, next) => {
  const funnelStatusValidationRules = {
    status: Joi.string().required(),
    stage: Joi.string().required(),
    rate: Joi.string().required(),
    level: Joi.number().required(),
    order: Joi.number().required(),
  };

  const { body } = req;
  try {
    await validate(funnelStatusValidationRules, req);
    const data = await funnelStatusService.createFunnelStatus(body);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.updateFunnelStatus = async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;

  const funnelStatusValidationRules = {
    status: Joi.string(),
    stage: Joi.string(),
    rate: Joi.string(),
    level: Joi.number(),
    order: Joi.number(),
  };

  try {
    await validate(funnelStatusValidationRules, req);
    const data = await funnelStatusService.updateFunnelStatus(id, body);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.deleteFunnelStatus = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await funnelStatusService.deleteFunnelStatus(id);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.getFunnel = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const data = await funnelStatusService.getFunnel(workspaceId);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};
