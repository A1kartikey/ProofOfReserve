const mongoose = require("mongoose");

const Exchange_Wallets = mongoose.Schema(
  {
    CRYPTOASSET: String,
    WALLETADDRESS: String,
    BALANCE: String,
    ASOFDATE: String,
    VERIFIED_OWNERSHIP: String,
    VERIFIED_DATE: String,
    date: String,
    exchange_name: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Exchange_Wallets", Exchange_Wallets);
