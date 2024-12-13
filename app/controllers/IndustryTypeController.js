const Joi = require("joi");
const industryTypeService = require("../services/IndustryTypeService");

exports.getAllIndustryTypes = async (req, res, next) => {
  try {
    const data = await industryTypeService.getAllIndustryTypes();
    res.status(201).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
}; 

exports.getIndustryTypeById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await industryTypeService.getIndustryTypeById(id);
    res.status(201).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.createIndustryType = async (req, res, next) => {
  const { body } = req;
  const industryTypeValidationRules = {
    name: Joi.string().required(),
    isActive: Joi.boolean().required(),
  };
  try {
    await validate(industryTypeValidationRules, req);
    const data = await industryTypeService.createIndustryType(body);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.updateIndustryType = async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  const industryTypeValidationRules = {
    name: Joi.string(),
    isActive: Joi.boolean(),
  };
  try {
    await validate(industryTypeValidationRules, req);
    const data = await industryTypeService.updateIndustryType(id, body);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.deleteIndustryType = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await industryTypeService.deleteIndustryType(id);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};
