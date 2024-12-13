const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const opportunitySchema = Schema({
  referenceNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
  },
  designation: {
    type: String,
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  completionDate: {
    type: Date,
  },
  status: {
    type: String,
  },
  workspaceId: {
    type: Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "Client", // Reference to the Client schema
    required: true,
  },
  funnelStatusId: {
    type: Schema.Types.ObjectId,
    ref: "FunnelStatus",
    default: "6565da8982ae860f776de5df",
  },
  leadId: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User schema
  },
  team: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  partners: [
    {
      type: Schema.Types.ObjectId,
      ref: "Partner",
    },
  ],
  opportunityMappingRoles: [
    {
      name: {
        type: String,
      },
      designation: {
        type: String,
      },
      department: {
        type: String,
      },
      role: {
        type: String,
      },
      impact: {
        type: String,
      },
      status: {
        type: String,
      },
    },
  ],
});

opportunitySchema.virtual("opportunity-task", {
  ref: "Task",
  localField: "_id",
  foreignField: "opportunityId",
});

opportunitySchema.pre("save", async function (next) {
  try {
    if (!this.referenceNumber) {
      // If referenceNumber doesn't exist, generate and assign a new one
      const latestOpportunity = await this.constructor.findOne(
        {},
        {},
        { sort: { referenceNumber: -1 } }
      );
      const nextReferenceNumber = latestOpportunity
        ? latestOpportunity.referenceNumber + 1
        : 1;
      this.referenceNumber = nextReferenceNumber;
    }
    next();
  } catch (error) {
    next(error);
  }
});
opportunitySchema.pre("find", function (next) {
  this.populate({
    path: "funnelStatusId",
    select: "status stage rate order level"
  });
  this.populate("leadId", "name designation");
  this.populate("team", "name image");
  this.populate("clientId", "name");
  next();
});
module.exports = mongoose.model("Opportunity", opportunitySchema);
