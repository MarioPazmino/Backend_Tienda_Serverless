const commentStatsRepository = require('../repositories/comment.stats.repository');

exports.getStatsByProduct = async (productId) => {
  return await commentStatsRepository.getStatsByProduct(productId);
};
