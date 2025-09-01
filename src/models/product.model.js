const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    categoria: [{ type: String, required: true }],
    imagen: { type: String },
    destacado: { type: Boolean, default: false },
    caracteristicas: [{ type: String }],
    marca: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
