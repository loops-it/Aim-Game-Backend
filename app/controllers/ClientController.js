const { validationException } = require("../exception");
const clientService = require("../services/ClientService");
const { validationRules } = require("../helper/validationHelper");
const validate = global.validate;

exports.getAllClients = async (req, res, next) => {
  try {
    const data = await clientService.getAllClients();
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};



exports.getAllClientsByWorkspaceId = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    if (!workspaceId) {
      throw new validationException("workspaceId is required");
    }
    const data = await clientService.getAllClientsByWorkspaceId(
      workspaceId
    );
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }
};

exports.getClientById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new validationException("id is required");
    }
    const data = await clientService.getClientById(id);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) { 
    next(error);
  }
};

exports.createClient = async (req, res, next) => {
  console.log("create client controller : ", req.body)
  try {
    // await validate(validationRules.createClient, req.body);
    const data = await clientService.createClient(req.body);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
  
};

exports.updateClient = async (req, res, next) => {
  const { id } = req.params;
  try {
    await validate(validationRules.updateClient, req);
    const data = await clientService.updateClient(id, req.body);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.deleteClient = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await clientService.deleteClient(id);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};

exports.searchClients = async (req, res, next) => {
  try {
    const { searchValue } = req.params;
    const data = await clientService.searchClients(searchValue);
    res.status(200).json({ success: true, status: 200, data });
  } catch (error) {
    next(error);
  }

  
};