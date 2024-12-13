const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    refNo: {
      type: String,
    },
    photo: {
      type: String,
    },
    address: {
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
    industryTypeId: {
      type: Schema.Types.ObjectId,
      ref: "IndustryType",
      required: true,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    }
  },
  { timestamps: true }
);

clientSchema.virtual("opportunity-client", {
  ref: "Opportunity",
  localField: "_id",
  foreignField: "clientId",
});

clientSchema.virtual("partner-client", {
  ref: "Partner",
  localField: "_id",
  foreignField: "clientId",
});

clientSchema.pre("find", function (next) {
  this.populate("industryTypeId", "name"); 
  next();
});
module.exports = mongoose.model("Client", clientSchema);
