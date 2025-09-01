
const { connect } = require('../../config.db');
const productService = require('../../services/product.service');
const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');

module.exports.handler = async (event) => {
  try {
    await connect();
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

    // Validación con Joi
    const schema = Joi.object({
      name: Joi.string().max(100).required(),
      description: Joi.string().max(1000).allow(''),
      price: Joi.number().min(0).required(),
      stock: Joi.number().integer().min(0).default(0),
      categoria: Joi.array().items(Joi.string().max(50)).min(1).required(),
      imagen: Joi.string().uri().allow(''),
      destacado: Joi.boolean().default(false),
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
    value.name = sanitizeHtml(value.name);
    if (value.description) value.description = sanitizeHtml(value.description);
    if (value.marca) value.marca = sanitizeHtml(value.marca);
    if (value.caracteristicas) value.caracteristicas = value.caracteristicas.map(sanitizeHtml);

    const newProduct = await productService.createProduct(value);
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
