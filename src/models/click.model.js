const mongoose = require('mongoose');

const ClickSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Click', ClickSchema);
