const commentRepository = require('../repositories/comment.repository');

exports.create = async (data) => {
  return await commentRepository.create(data);
};

exports.getByProduct = async (productId, page = 1, limit = 10) => {
  return await commentRepository.getByProduct(productId, page, limit);
};
