const e = require("express");
const IndustryTypeModel = require("../models/industryType");

exports.getAllIndustryTypes = async () => {
  const industryTypes = await IndustryTypeModel.find({});
  return industryTypes;
};

exports.getIndustryTypeById = async (id) => {
  const industryType = await IndustryTypeModel.findById(id);
  return industryType;
};

exports.createIndustryType = async (industryType) => {
  const newIndustryType = await new IndustryTypeModel(industryType).save();
  return newIndustryType;
};

exports.updateIndustryType = async (id, industryType) => {
  const updatedIndustryType = await IndustryTypeModel.findByIdAndUpdate(
    id,
    industryType,
    { new: true }
  );
  return updatedIndustryType;
};

exports.deleteIndustryType = async (id) => {
  const deletedIndustryType = await IndustryTypeModel.findByIdAndDelete(id);
  return deletedIndustryType;
};
