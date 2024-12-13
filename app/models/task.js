const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    funnelStatus: {
      type: Schema.Types.ObjectId,
      ref: "FunnelStatus",
      default: "6565da8982ae860f776de5df",
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
    },
    reminder: {
      type: Date,
    },
    note: {
      type: String,
    },
    opportunityId: {
      type: Schema.Types.ObjectId,
      ref: "Opportunity",
    },
  },
  { timestamps: true }
);
taskSchema.pre("find", function (next) {
  this.populate("opportunityId", "name");
  this.populate("assignee", "name");
  next();
});
module.exports = mongoose.model("Task", taskSchema);
