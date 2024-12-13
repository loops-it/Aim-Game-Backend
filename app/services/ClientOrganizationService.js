const ClientOrganizationModel = require("../models/clientOrganization");

exports.getAllClientOrganizations = async () => {
  return await ClientOrganizationModel.find();
};

exports.getClientOrganizations = async (clientId) => {
  try {
    const clientOrganizations = await ClientOrganizationModel.find({
      client: clientId,
    });
    return clientOrganizations;
  } catch (error) {
    throw error;
  }
};
exports.getClientOrganizationById = async (id) => {
  return await ClientOrganizationModel.findById(id);
};

exports.createClientOrganization = async (clientOrganizationData) => {
  return await ClientOrganizationModel.create(clientOrganizationData);
};

exports.updateClientOrganization = async (id, updateData) => {
  return await ClientOrganizationModel.findByIdAndUpdate(id, updateData, {
    new: true,
  });
};

exports.deleteClientOrganizationById = async (id) => {
  return await ClientOrganizationModel.findByIdAndDelete(id);
};
