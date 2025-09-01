const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  nombre: { type: String, required: true },
  calificacion: { type: Number, required: true, min: 1, max: 5 },
  comentario: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);
