
const { connect } = require('../../config.db');
const adminService = require('../../services/admin.service');
const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');

module.exports.handler = async (event) => {
  try {
    await connect();
    const { id } = event.pathParameters;
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

    // Validación con Joi
    const schema = Joi.object({
      fechaExpiracion: Joi.date().iso().required()
    });
    const { error, value } = schema.validate(body);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.details[0].message })
      };
    }

    // Sanitizar id
    const cleanId = sanitizeHtml(id);

    const updated = await adminService.setFechaExpiracion(cleanId, value.fechaExpiracion);
    if (!updated) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Administrador no encontrado' })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Fecha de expiración actualizada', fechaExpiracion: updated.fechaExpiracion })
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message })
    };
  }
};
