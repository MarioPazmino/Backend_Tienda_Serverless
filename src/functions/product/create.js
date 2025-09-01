const { connect } = require('../../config.db');
const productService = require('../../services/product.service');

module.exports.handler = async (event) => {
  try {
    await connect();
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const newProduct = await productService.createProduct(body);
    return {
      statusCode: 201,
      body: JSON.stringify(newProduct)
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message })
    };
  }
};
