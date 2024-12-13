const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const funnelStatusSchema = Schema(
  {
    status: {
      type: String,
      required: true,
    },
    stage: {
      type: String,
      required: true,
    },
    rate: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    no: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FunnelStatus", funnelStatusSchema);
