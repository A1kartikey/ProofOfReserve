const mongoose = require("mongoose");

const Wallet_Assettype = mongoose.Schema(
  {
    date: String,
    exchange_name: String,
    assetType: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Wallet_Assettype", Wallet_Assettype);
