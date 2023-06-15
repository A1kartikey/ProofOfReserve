const mongoose = require('mongoose');

const Exchange_liabilities = mongoose.Schema({
    Customer_ID: String,
    Cryptoasset: String,
    Balance: String,
    ASOFDATE: String,
    exchange_name: String,
    date: String

}, {
    timestamps: true
});

module.exports = mongoose.model('liabilities', Exchange_liabilities);