const { validationException } = require("../exception");
const partnerService = require("../services/PartnerService");
const { validationRules } = require("../helper/validationHelper");

const validate = global.validate;

exports.getAllPartners = async (req, res, next) => {
  try {
    const data = await partnerService.getAllPartners();
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.getAllPartnersByWorkspaceId = async (req, res, next) => {
  try {
    const workspaceId = req.user.workspaceId;
    const data = await partnerService.getAllPartnersByWorkspace(workspaceId);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.getPartnerById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new validationException("id is required");
    }
    const data = await partnerService.getPartnerById(id);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.createPartner = async (req, res, next) => {
  try {
    await validate(validationRules.createPartner, req);
    const data = await partnerService.createPartner(req.body);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.updatePartner = async (req, res, next) => {
  const { id } = req.params;
  try {
    await validate(validationRules.updatePartner, req);
    const data = await partnerService.updatePartner(id, req.body);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.deletePartner = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await partnerService.deletePartner(id);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.filterByWorkspace = async (req, res, next) => {
  try {
    const workspaceId = req.params.workspaceId;
    const data = await partnerService.filterByWorkspace(workspaceId);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};
exports.companies = async (req, res, next) => {
  try {
    const data = await partnerService.companies();
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};
exports.partnersFilter = async (req, res, next) => {
  try {
    const data = await partnerService.partnersFilter(req);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};