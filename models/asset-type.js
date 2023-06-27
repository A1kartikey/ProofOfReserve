const mongoose = require("mongoose");

const Assettype = mongoose.Schema(
  {
    date: String,
    exchange_name: String,
    // exchange_id: String,
    assetType: [{ type: String }],
    totalsum: {
      type: mongoose.SchemaTypes.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Assettype", Assettype);
