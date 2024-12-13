const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const industryTypeSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

industryTypeSchema.virtual("workspace-industryType", {
  ref: "Workspace",
  localField: "_id",
  foreignField: "industryTypeId",
});

industryTypeSchema.virtual("client-industryType", {
  ref: "Client",
  localField: "_id",
  foreignField: "industryTypeId",
});

module.exports = mongoose.model("IndustryType", industryTypeSchema);
