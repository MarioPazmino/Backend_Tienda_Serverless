
const { connect } = require('../../config.db');
const commentService = require('../../services/comment.service');
const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');

module.exports.handler = async (event) => {
  try {
    await connect();
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

    // Validación con Joi
    const schema = Joi.object({
      productId: Joi.string().required(),
      nombre: Joi.string().max(100).required(),
      calificacion: Joi.number().integer().min(1).max(5).required(),
      comentario: Joi.string().max(1000).required()
    });
    const { error, value } = schema.validate(body);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.details[0].message })
      };
    }

    // Sanitizar campos de texto
    value.nombre = sanitizeHtml(value.nombre);
    value.comentario = sanitizeHtml(value.comentario);

    const comment = await commentService.create(value);
    return {
      statusCode: 201,
      body: JSON.stringify(comment)
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message })
    };
  }
};
