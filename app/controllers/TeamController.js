const { validationException } = require("../exception");
const teamService = require("../services/TeamService");
const { validationRules } = require("../helper/validationHelper");
const Joi = require("joi");
const validate = global.validate;

exports.getTeamMembers = async (req, res, next) => {
  try {
    const data = await teamService.getTeamMembers();
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};
exports.getTeamMembersPresales = async (req, res, next) => {
  try {
    const data = await teamService.getTeamMembersPresales();
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};
exports.createTeamMember = async (req, res, next) => {

    const validationRule = {
        name: Joi.string().required(),
        email: Joi.string().required(),
        designation: Joi.string().required(),
        phone: Joi.string().required(),
      };
      try {
        await validate(validationRule, req);
        const data = await teamService.createTeamMember(req.body);
        res.status(201).json({ success: true, status: 201, data });
      } catch (error) {
        next(error);
      }
  };

exports.updateTeamMember = async (req, res, next) => {
    const { id } = req.params;
    const validationRule = {
        name: Joi.string().required(),
        email: Joi.string().required(),
        designation: Joi.string().required(),
        phone: Joi.string().required(),
      };
    try {
      await validate(validationRule, req);
      const data = await teamService.updateTeamMember(id, req.body);
      res.status(201).json({ success: true, status: 201, data });
    } catch (error) {
      next(error);
    }
  };
  exports.searchTeamMembers = async (req, res, next) => {
    try {
      const { searchValue } = req.params;
      const data = await teamService.searchTeamMembers(searchValue);
      res.status(200).json({ success: true, status: 200, data });
    } catch (error) {
      next(error);
    }
  
    
  };