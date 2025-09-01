const { connect } = require('../../config.db');
const productService = require('../../services/product.service');

module.exports.handler = async (event) => {
  try {
    await connect();
    const query = event.queryStringParameters || {};
    const result = await productService.getAllProducts(query);
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
