const mongoose = require("mongoose");

const Total_liabilities = mongoose.Schema(
  {
    date: String,
    exchange_name: String,
    // exchange_id: String,
    Customer_ID: String,
    sum: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Total_liabilities", Total_liabilities);
