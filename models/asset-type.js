const mongoose = require("mongoose");

const Assettype = mongoose.Schema(
  {
    date: String,
    exchange_name: String,
    // exchange_id: String,
    assetType: [{ type: String }]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Assettype", Assettype);
