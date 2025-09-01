const { connect } = require('../../config.db');
const productService = require('../../services/product.service');

module.exports.handler = async (event) => {
  try {
    await connect();
    const { id } = event.pathParameters;
    const deletedProduct = await productService.deleteProduct(id);
    if (!deletedProduct) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Producto no encontrado' })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Producto eliminado' })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
