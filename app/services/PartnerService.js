const { notFoundException } = require("../exception");
const PartnerModel = require("../models/partner");
const WorkspaceModel = require("../models/workspace");
const s3service = require("./s3Service");

exports.getAllPartners = async () => {
  const partners = await PartnerModel.find({});
  return partners;
};

exports.getAllPartnersByWorkspace = async (workspaceId) => {
  const partners = await PartnerModel.find({ workspaceId: workspaceId });
  return partners;
};

exports.getPartnerById = async (id) => {
  const partner = await PartnerModel.findById(id);
  return partner;
};

exports.createPartner = async (partner) => {
  const workspaceIdExists = await WorkspaceModel.findOne({
    _id: partner.workspaceId,
  });

  if (!workspaceIdExists) {
    console.log("Workspace not found");
    throw new notFoundException("Workspace not found");
  }

  if (
    partner.image !== null &&
    partner.image !== undefined &&
    partner.image !== ""
  ) {
    const image = partner.image;
    const imageData = await s3service.upload(image, "partners");
    partner.image = imageData.Location;
  }

  const newPartner = await new PartnerModel(partner).save();
  return newPartner;
};

exports.updatePartner = async (id, partner) => {
  if (
    partner.workspaceId &&
    partner.workspaceId !== null &&
    partner.workspaceId !== undefined
  ) {
    const workspaceIdExists = await WorkspaceModel.findOne({
      _id: partner.workspaceId,
    });

    if (!workspaceIdExists) {
      console.log("Workspace not found");
      throw new notFoundException("Workspace not found");
    }
  }

  if (
    partner.image !== null &&
    partner.image !== undefined &&
    partner.image !== ""
  ) {
    const image = partner.image;
    const imageData = await s3service.upload(image, "partners");
    partner.image = imageData.Location;
  }

  const updatedPartner = await PartnerModel.findByIdAndUpdate(id, partner, {
    new: true,
  });
  return updatedPartner;
};

exports.deletePartner = async (id) => {
  const deletedPartner = await PartnerModel.findByIdAndDelete(id);
  return deletedPartner;
};

exports.filterByWorkspace = async (workspaceId) => {
  console.log(workspaceId);
  const partners = await PartnerModel.find({ workspaceId: workspaceId });
  return partners;
};

exports.companies = async () => {
  //.log(123);
  //const companies = await PartnerModel.distinct("company");
  const companies = await PartnerModel.aggregate([
    {
      $group: {
        _id: "$company",
        id: { $first: "$_id" }
      }
    },
    {
      $project: {
        _id: 0,
        company: "$_id",
        id: 1
      }
    }
  ]);
  return companies;
};
exports.partnersFilter = async (req) => {
  // 1. Access Data from Request Body (if applicable)
  const filterData = req.body || {}; // Get data from request body (if provided)

  // 2. Construct Filter Criteria
  const filters = {};
  if (filterData.workspace) {
    filters.workspaceId = filterData.workspace;
  }
  if (filterData.client) {
    filters.client = { $regex: new RegExp(filterData.client, 'i') }; 
  }
  if (filterData.company) {
    filters.company = { $regex: new RegExp(filterData.company, 'i') };
  }

  // 3. Filter Partners from MongoDB
  const partners = await PartnerModel.find(filters);

  // 4. Return Filtered Partners
  return partners;
};