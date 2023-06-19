const mongoose = require("mongoose");

const leaf_hash = mongoose.Schema(
  {
    date: String,
    exchange_name: String,
    leafhash: {
      type: mongoose.SchemaTypes.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("leaf_hash", leaf_hash);
