const e = require("express");
const { notFoundException } = require("../exception");
const ClientModel = require("../models/client");
const WorkspaceModel = require("../models/workspace");
const IndustryTypeModel = require("../models/industryType");
const s3service = require("../services/s3Service");

exports.getAllClients = async () => {
  const clients = await ClientModel.find({});
  return clients;
};


exports.getAllClientsByWorkspaceId = async (workspaceId) => {
  console.log("sadasd",workspaceId);
  const clients = await ClientModel.find({ workspaceId: workspaceId });
  return clients;
};

exports.getClientById = async (id) => {
  const client = await ClientModel.findById(id);
  return client;
};

exports.createClient = async (client) => {

  const clientEmailExists = await ClientModel.findOne({
    email: client.email,
  });
  const workspaceIdExists = await WorkspaceModel.findOne({
    _id: client.workspaceId,
  });
  const industryTypeIdExists = await IndustryTypeModel.findOne({
    _id: client.industryTypeId, 
  });
  const clientRefExists = await ClientModel.findOne({
    refNo: client.refNo, 
  });
 
  if (clientEmailExists) {
    console.log("Email already exists");
    throw new notFoundException("Email already exists");
  }else if (clientRefExists) { 
    console.log("Ref no already exists");
    throw new notFoundException("Ref no already exists");
  } else if (!workspaceIdExists) { 
    console.log("Workspace not found");
    throw new notFoundException("Workspace not found");
  } else if (!industryTypeIdExists) {
    console.log("Industry Type not found");
    throw new notFoundException("Industry Type not found");
  } else {
    if (client.photo)  {
      const image = client.photo;
      const imageData = await s3service.upload(image, "clients");
      client.photo = imageData.Location;
    }
    else{
      client.photo = null;
    }
    // if (
    //   client.photo !== null &&
    //   client.photo !== undefined &&
    //   client.photo !== ""
    // ) {
    //   console.log("client.photo :", client.photo)
    //   const image = client.photo;
    //   // const imageData = await s3service.upload(image, "clients");
    //   const imagePath = "/uploads/" + client.photo.filename;
    //   // client.photo = imageData.Location;
    //   client.photo = imagePath;
    // }
    const newClient = await new ClientModel(client).save();
    return newClient;
  }
};



exports.updateClient = async (id, client) => {
  if (client.industryTypeId) {
    const workspaceIdExists = await WorkspaceModel.findOne({
      _id: client.workspaceId,
    });
    if (!workspaceIdExists) {
      console.log("Workspace not found");
      throw new notFoundException("Workspace not found");
      
    }
  }
  if (client.workspaceId) {
    const industryTypeIdExists = await IndustryTypeModel.findOne({
      _id: client.industryTypeId,
    });
    if (!industryTypeIdExists) {
      console.log("Industry Type not found");
      throw new notFoundException("Industry Type not found");
    }
  }
  // if (
  //   client.photo !== null &&
  //   client.photo !== undefined &&
  //   client.photo !== ""
  // ) {
  //   const image = client.photo;
  //   const imageData = await s3service.upload(image, "clients");
  //   client.photo = imageData.Location;
  // }
  const currentUser = await ClientModel.findById(id);
  if (!currentUser) {
      throw new Error("User not found");
  }
  if (client.photo && client.photo !== currentUser.photo) {
      const image = client.photo;
      try {
          const imageData = await s3service.upload(image, "clients");
          client.photo = imageData.Location;
      } catch (error) {
          throw new Error('Image upload failed: ' + error.message);
      }
  } else {
    client.photo = currentUser.photo;
  }
  const updatedClient = await ClientModel.findByIdAndUpdate(id, client, {
    new: true,
  });
  return updatedClient;
};

exports.deleteClient = async (id) => {
  const deletedClient = await ClientModel.findByIdAndDelete(id);
  return deletedClient;
};

exports.searchClients = async (searchValue) => {
  console.log("searchValue", searchValue);
  const clients = await ClientModel.find(  {
    refNo: searchValue,
  }).exec();

  return clients;
};