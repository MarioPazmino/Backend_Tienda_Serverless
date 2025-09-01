const mongoose = require('mongoose');
const Comment = require('../models/comment.model');

exports.getStatsByProduct = async (productId) => {
  const stats = await Comment.aggregate([
    { $match: { productId: typeof productId === 'string' ? mongoose.Types.ObjectId(productId) : productId } },
    {
      $group: {
        _id: '$calificacion',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const total = stats.reduce((acc, s) => acc + s.count, 0);
  const sum = stats.reduce((acc, s) => acc + s._id * s.count, 0);
  const promedio = total > 0 ? sum / total : 0;
  const distribucion = {};
  for (let i = 1; i <= 5; i++) {
    distribucion[i] = 0;
  }
  stats.forEach(s => {
    distribucion[s._id] = s.count;
  });

  return {
    total,
    promedio: Number(promedio.toFixed(2)),
    distribucion
  };
};
