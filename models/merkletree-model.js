const mongoose = require('mongoose');

const merkletree = mongoose.Schema({
    date: String,
    exchange_name: String,
    // exchange_id: String,
    merkletree: {
                type: mongoose.SchemaTypes.Mixed,
                 required: true
               }
    
}, {
    timestamps: true
});

module.exports = mongoose.model('merkletree', merkletree);