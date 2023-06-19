const mongoose = require("mongoose");

const merkletree = mongoose.Schema(
  {
    date: String,
    exchange_name: String,
    merkletree: {
      type: mongoose.SchemaTypes.Mixed,
      required: true,
    },
    Root_hash: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("merkletree", merkletree);
