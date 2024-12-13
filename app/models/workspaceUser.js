const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workspaceUserSchema = Schema(
  {
    role: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
    },
    phone: {
      type: String, 
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkspaceUser", workspaceUserSchema);
