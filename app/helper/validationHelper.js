const Joi = require("joi");

const validationRules = {
  createPartner: {
    name: Joi.string().min(1).max(255).required(),
    company: Joi.string().optional().allow("", null),
    image: Joi.string().allow("", null),
    workspaceId: Joi.string().required(),
    contacts: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          business: Joi.string().allow("", null),
          designation: Joi.string().optional().allow("", null).required(),
          email: Joi.string().email().optional().allow("", null).required(),
          phone: Joi.string().optional().allow("", null).required(),
          isPrimary: Joi.boolean().optional().allow("", null),
        })
      )
      .optional()
      .min(0),
  },
  updatePartner: {
    name: Joi.string().min(1).max(255).required(),
    company: Joi.string().optional(),
    image: Joi.string().allow("", null),
    workspaceId: Joi.string().optional(),
    contacts: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().optional(),
          designation: Joi.string().optional().allow("", null),
          email: Joi.string().email().optional().allow("", null),
          phone: Joi.string().optional().allow("", null),
          isPrimary: Joi.boolean().optional().allow("", null),
        })
      )
      .optional(),
  },
  createUser: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
  verifyUser: {
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
  },
  updateUser: {
    name: Joi.string().optional(),
    password: Joi.string().optional(),
    email: Joi.string().email().optional(),
    otp: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
  },
  createClient: {
    name: Joi.string().required(),
    address: Joi.string().required(),
    // photo: Joi.string().allow("", null).optional(),
    industryTypeId: Joi.string().required(),
    email: Joi.string().email().required(),
    workspaceId: Joi.string().required(),
    phone: Joi.string().allow("", null),
  },
  updateClient: {
    name: Joi.string().min(1).max(255).optional(), // Example: Ensure the name is between 1 and 255 characters
    address: Joi.string().optional(),
    photo: Joi.string().optional(), // Assuming 'photo' is a URL
    industryTypeId: Joi.string().optional(),
    email: Joi.string().email().optional(),
    workspaceId: Joi.string().optional(),
    phone: Joi.string().optional().allow("", null),
  },
  createOpportunity: {
    name: Joi.string().required(),
    workspaceId: Joi.string().required(),
    clientId: Joi.string().required(),
    funnelStatusId: Joi.string().optional(),
    leadId: Joi.string().required(),
    team: Joi.array(),
    partners: Joi.array(),
  },
  updateOpportunity: {
    name: Joi.string().optional(),
    workspaceId: Joi.string().optional(),
    clientId: Joi.string().optional(),
    leadId: Joi.string().optional(),
    team: Joi.array(),
    partners: Joi.array(),
    opportunityMappingRoles: Joi.array(),
  },
  clientOrganizationValidationRules: {
    name: Joi.string().required(),
    designation: Joi.string().required(),
    department: Joi.string().required(),
    email: Joi.string().email().optional().allow("", null),
    phone: Joi.string().optional().allow("", null),
    client: Joi.string().required(),
  },
};

module.exports = { validationRules };
