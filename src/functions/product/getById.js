const { connect } = require('../../config.db');
const productService = require('../../services/product.service');

module.exports.handler = async (event) => {
  try {
    await connect();
    const { id } = event.pathParameters;
    const product = await productService.getProductById(id);
    if (!product) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Producto no encontrado' })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(product)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
