const { connect } = require('../../config.db');
const commentService = require('../../services/comment.service');

module.exports.handler = async (event) => {
  try {
    await connect();
    const { productId } = event.pathParameters;
    const { page = 1, limit = 10 } = event.queryStringParameters || {};
    const result = await commentService.getByProduct(productId, page, limit);
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
