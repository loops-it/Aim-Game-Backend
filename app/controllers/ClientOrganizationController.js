const { validationException } = require("../exception");
const clientOrganizationService = require("../services/ClientOrganizationService");
const { validationRules } = require("../helper/validationHelper");
const validate = global.validate;

exports.getAllClientOrganizations = async (req, res, next) => {
  try {
    const data = await clientOrganizationService.getAllClientOrganizations();
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.getOrganizationsByClient = async (req, res, next) => {
  const { clientId } = req.params;
  try {
    if (!clientId) {
      throw new validationException("clientId is required");
    }

    const data = await clientOrganizationService.getClientOrganizations(
      clientId
    );

    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.getClientOrganizationById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new validationException("id is required");
    }
    const data = await clientOrganizationService.getClientOrganizationById(id);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.createClientOrganization = async (req, res, next) => {
  try {
    await validate(validationRules.clientOrganizationValidationRules, req);
    const data = await clientOrganizationService.createClientOrganization(
      req.body
    );
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.updateClientOrganization = async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    if (!id) {
      throw new validationException("id is required");
    }

    const updatedClientOrganization =
      await clientOrganizationService.updateClientOrganization(id, updateData, {
        new: true,
      });

    if (!updatedClientOrganization) {
      throw new Error("Client Organization not found");
    }

    res
      .status(200)
      .json({ success: true, status: 200, data: updatedClientOrganization });
  } catch (error) {
    next(error);
  }
};

exports.deleteClientOrganizationById = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!id) {
      throw new validationException("id is required");
    }

    const deletedClientOrganization =
      await clientOrganizationService.deleteClientOrganizationById(id);

    if (!deletedClientOrganization) {
      throw new Error("Client Organization not found");
    }

    res.status(204).json({
      success: true,
      status: 204,
      message: "Client Organization deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
