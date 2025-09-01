
const { connect } = require('../../config.db');
const productService = require('../../services/product.service');
const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');

module.exports.handler = async (event) => {
  try {
    await connect();
    const { id } = event.pathParameters;
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

    // Validación con Joi (campos opcionales)
    const schema = Joi.object({
      name: Joi.string().max(100),
      description: Joi.string().max(1000).allow(''),
      price: Joi.number().min(0),
      stock: Joi.number().integer().min(0),
      categoria: Joi.array().items(Joi.string().max(50)),
      imagen: Joi.string().uri().allow(''),
      destacado: Joi.boolean(),
      caracteristicas: Joi.array().items(Joi.string().max(200)),
      marca: Joi.string().max(100).allow('')
    });
    const { error, value } = schema.validate(body);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.details[0].message })
      };
    }

    // Sanitizar campos de texto
    if (value.name) value.name = sanitizeHtml(value.name);
    if (value.description) value.description = sanitizeHtml(value.description);
    if (value.marca) value.marca = sanitizeHtml(value.marca);
    if (value.caracteristicas) value.caracteristicas = value.caracteristicas.map(sanitizeHtml);

    const updatedProduct = await productService.updateProduct(id, value);
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
