const { connect } = require('../../config.db');
const productService = require('../../services/product.service');

module.exports.handler = async (event) => {
  try {
    await connect();
    const { id } = event.pathParameters;
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const updatedProduct = await productService.updateProduct(id, body);
    if (!updatedProduct) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Producto no encontrado' })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(updatedProduct)
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message })
    };
  }
};
