const { validationException } = require("../exception");
const opportunityService = require("../services/OpportunityService");
const { validationRules } = require("../helper/validationHelper");

const validate = global.validate;

exports.getAllOpportunities = async (req, res, next) => {
  try {
    const filter = req.query;

    const data = await opportunityService.getAllOpportunities(filter);
    // console.log("all data : ", data);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.getOpportunitiesByWorkspaceId = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    if (!workspaceId) {
      throw new validationException("workspaceId is required");
    }
    const data = await opportunityService.getOpportunitiesByWorkspaceId(
      workspaceId
    );
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.getOpportunitiesByWorkspaceAndClient = async (req, res, next) => {
  try {
    const { workspaceId, clientId } = req.params;

    // Validate that both workspaceId and clientId are provided
    if (!workspaceId || !clientId) {
      throw new validationException(
        "Both workspaceId and clientId are required"
      );
    }

    // Call the service to get opportunities by workspaceId and clientId
    const data = await opportunityService.getOpportunitiesByWorkspaceAndClient(
      workspaceId,
      clientId
    );

    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.getOpportunitiesByClientId = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    if (!clientId) {
      throw new validationException("clientId is required");
    }
    const data = await opportunityService.getOpportunitiesByClientId(clientId);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.getOpportunityById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new validationException("id is required");
    }
    const data = await opportunityService.getOpportunityById(id);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.createOpportunity = async (req, res, next) => {
  try {
    await validate(validationRules.createOpportunity, req);
    const data = await opportunityService.createOpportunity(req.body);
    // console.log("data create: ", data);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.updateOpportunity = async (req, res, next) => {
  const { id } = req.params;
  try {
    await validate(validationRules.updateOpportunity, req);
    const data = await opportunityService.updateOpportunity(id, req.body);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.deleteOpportunity = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await opportunityService.deleteOpportunity(id);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.getOpportunityMappingRole = async (req, res, next) => {
  try {
    const { id, roleId } = req.params;
    const data = await opportunityService.getOpportunityMappingRole(id, roleId);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.createOpportunityMappingRole = async (req, res, next) => {
  try { 
    const { id } = req.params;
    const data = await opportunityService.createOpportunityMappingRole(
      id,
      req.body
    );
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.updateOpportunityMappingRole = async (req, res, next) => {
  try {
    const { id, roleId } = req.params;

    const data = await opportunityService.updateOpportunityMappingRole(
      id,
      roleId,
      req.body
    );
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.deleteOpportunityMappingRole = async (req, res, next) => {
  try {
    const { id, roleId } = req.params;
    const data = await opportunityService.deleteOpportunityMappingRole(
      id,
      roleId
    );
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.getOpportunityMembers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await opportunityService.getOpportunityMembers(id);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.getOpportunityMappingRoles = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await opportunityService.getOpportunityMappingRoles(id);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }

  
};

exports.searchOpportunities = async (req, res, next) => {
  try {
    const { searchValue } = req.params;
    const data = await opportunityService.searchOpportunities(searchValue);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }

  
};