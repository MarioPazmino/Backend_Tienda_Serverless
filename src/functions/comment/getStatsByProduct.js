const { connect } = require('../../config.db');
const commentStatsService = require('../../services/comment.stats.service');

module.exports.handler = async (event) => {
  try {
    await connect();
    const { productId } = event.pathParameters;
    const stats = await commentStatsService.getStatsByProduct(productId);
    return {
      statusCode: 200,
      body: JSON.stringify(stats)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
