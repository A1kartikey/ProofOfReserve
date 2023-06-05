const mongoose = require('mongoose');

const WalletSchema = mongoose.Schema({
    date: String,
    exchange_name: String,
    // exchange_id: String,
    wallet_details: {
        type: mongoose.SchemaTypes.Mixed,
        required: true
      }
}, {
    timestamps: true
});

module.exports = mongoose.model('Wallet', WalletSchema);