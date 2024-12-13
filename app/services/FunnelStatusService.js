const e = require("express");
const { notFoundException } = require("../exception");
const FunnelStatusModel = require("../models/funnelStatus");
const OpportunityModel = require("../models/opportunity");
exports.getAllFunnelStatuses = async () => {
  const funnelStatuses = await FunnelStatusModel.find({});
  return funnelStatuses;
};

exports.getFunnelStatusById = async (id) => {
  const funnelStatus = await FunnelStatusModel.findById(id);
  return funnelStatus;
};

exports.createFunnelStatus = async (funnelStatus) => {
  const newFunnelStatus = await new FunnelStatusModel(funnelStatus).save();
  return newFunnelStatus;
};

exports.updateFunnelStatus = async (id, funnelStatus) => {
  const updatedFunnelStatus = await FunnelStatusModel.findByIdAndUpdate(
    id,
    funnelStatus,
    { new: true }
  );
  return updatedFunnelStatus;
};

exports.deleteFunnelStatus = async (id) => {
  const deletedFunnelStatus = await FunnelStatusModel.findByIdAndDelete(id);
  return deletedFunnelStatus;
};

exports.getFunnel = async (workspaceId) => {
  const funnelStatuses = await OpportunityModel.find({
    workspaceId: workspaceId,
  }).populate("funnelStatusId");
  const groupedData = Array.from({ length: 11 }, (_, index) => ({
    order: index + 1,
    data: [],
  })).reduce((grouped, item) => {
    grouped[item.order] = item.data;
    return grouped;
  }, {});

  // Populate the arrays with corresponding data
  funnelStatuses.forEach((item) => {
    const order = item.funnelStatusId.order;
    groupedData[order].push(item);
  });
  // Convert the grouped object back to an array
  const resultArray = Object.values(groupedData);

  console.log(resultArray);
  return resultArray;
};
