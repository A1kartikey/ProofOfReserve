const mongoose = require("mongoose");

const leaf_hash = mongoose.Schema(
  {
    date: String,
    exchange_name: String,
    Salting: String,
    asofdate: String,
    hash: String,
     ID:  String
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("leaf_hash", leaf_hash);
