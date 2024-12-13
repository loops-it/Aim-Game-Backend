const { validationException } = require("../exception");
const taskService = require("../services/TaskService");
const { validationRules } = require("../helper/validationHelper");
const Joi = require("joi");
const funnelStatus = require("../models/funnelStatus");
const validate = global.validate;

exports.getAllTasks = async (req, res, next) => {
  try {
    const data = await taskService.getAllTasks();
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.getTaskById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new validationException("id is required");
    }
    const data = await taskService.getTaskById(id);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.getAllTasksByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      throw new validationException("userId is required");
    }
    const data = await taskService.getAllTasksByUserId(userId);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.getAllTasksByOpportunityId = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;
    if (!opportunityId) {
      throw new validationException("opportunityId is required");
    }
    const data = await taskService.getAllTasksByOpportunityId(opportunityId);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.createTask = async (req, res, next) => {
  const validationRule = {
    name: Joi.string().required(),
    status: Joi.string().optional(),
    funnelStatusId: Joi.string().optional().allow(null),
    assignee: Joi.string().optional().allow(null),
    date: Joi.date().required(),
    priority: Joi.string().optional(),
    reminder: Joi.date().optional(),
    note: Joi.string().optional(),
    opportunityId: Joi.string().optional().allow(null), 
  };
  try {
    await validate(validationRule, req);
    const data = await taskService.createTask(req.body);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  const { id } = req.params;
  const validationRule = {
    name: Joi.string().optional(),
    status: Joi.string().optional(),
    funnelStatusId: Joi.string().optional().allow(null),
    assignee: Joi.string().optional().allow(null),
    date: Joi.date().required(),
    priority: Joi.string().optional(),
    reminder: Joi.date().optional(),
    note: Joi.string().optional(),
    opportunityId: Joi.string().optional().allow(null),
  };
  try {
    if (!id) {
      throw new validationException("id is required");
    }
    await validate(validationRule, req);
    const data = await taskService.updateTask(id, req.body);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.fetchMyTasks = async (req, res, next) => {
  try {
    console.log("req.user", req.user);
    const data = await taskService.fetchMyTasks(req.user?.userId);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};
