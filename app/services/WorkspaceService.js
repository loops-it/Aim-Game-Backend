const { notFoundException } = require("../exception");
const WorkspaceModel = require("../models/workspace");
const IndustryTypeModel = require("../models/industryType");
exports.getAllWorkspaces = async () => {
  // const workspaces = await WorkspaceModel.find({}).populate("industryTypeId");
  const workspaces = await WorkspaceModel.find({});
  return workspaces;
};

exports.getWorkspaceById = async (id) => {
  const workspace = await WorkspaceModel.findById(id).populate(
    "industryTypeId"
  );
  return workspace;
};

// exports.createWorkspace = async (workspace) => {
//   const industryTypeExists = await IndustryTypeModel.findOne({
//     _id: workspace.industryTypeId,
//   });
//   if (industryTypeExists) {
//     const newWorkspace = await new WorkspaceModel(workspace).save();
//     return newWorkspace;
//   } else {
//     console.log("Industry Type not found");
//     throw new notFoundException("Industry Type not found");
//   }
// };
exports.createWorkspace = async (workspace) => {
    const newWorkspace = await new WorkspaceModel(workspace).save();
    return newWorkspace;
};
exports.getWorkspaceByUser = async (userID) => {
  const workspace = await WorkspaceModel.find({
    userID: userID,
  });
  return workspace;
};
// exports.updateWorkspace = async (id, workspace) => {
//   const updatedWorkspace = await WorkspaceModel.findByIdAndUpdate(
//     id,
//     workspace,
//     { new: true,
//       select: "-createdAt -industryTypeId",
//      }
//   );
//   return updatedWorkspace;
// };
exports.updateWorkspace = async (id, workspace) => {
  const updatedWorkspace = await WorkspaceModel.findByIdAndUpdate(
    id,
    workspace
  );
  return updatedWorkspace;
};
exports.deleteWorkspace = async (id) => {
  const deletedWorkspace = await WorkspaceModel.findByIdAndDelete(id);
  return deletedWorkspace;
};

exports.getWorkspaceByIndustryType = async (industryTypeId) => {
  const workspace = await WorkspaceModel.find({
    industryTypeId: industryTypeId,
  });
  return workspace;
};

exports.getWorkspaceBySubscription = async (subscription) => {
  const workspace = await WorkspaceModel.find({ subscription: subscription });
  return workspace;
};

exports.getWorkspaceByContactEmail = async (contactEmail) => {
  const workspace = await WorkspaceModel.find({
    contactEmail: contactEmail,
  });
  return workspace;
};
