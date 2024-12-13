const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: { 
      type: String,
    },
    designation: { 
      type: String,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    userRole: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.virtual("user-opportunity-lead", {
  ref: "Opportunity",
  localField: "_id",
  foreignField: "leadId",
});

userSchema.virtual("user-opportunity", {
  ref: "Opportunity",
  localField: "_id",
  foreignField: "clientId",
});

userSchema.virtual("user-workspaceUser", {
  ref: "WorkspaceUser",
  localField: "_id",
  foreignField: "userId",
});

userSchema.virtual("user-task", {
  ref: "Task",
  localField: "_id",
  foreignField: "assignee",
});

module.exports = mongoose.model("User", userSchema);
