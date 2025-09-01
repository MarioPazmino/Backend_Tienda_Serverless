
const { connect } = require('../../config.db');
const adminService = require('../../services/admin.service');
const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');

module.exports.handler = async (event) => {
  try {
    await connect();
    const { id } = event.pathParameters;

    // Validación con Joi
    const schema = Joi.object({ id: Joi.string().required() });
    const { error, value } = schema.validate({ id });
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.details[0].message })
      };
    }

    // Sanitizar id
    const cleanId = sanitizeHtml(value.id);

    const deleted = await adminService.delete(cleanId);
    if (!deleted) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Administrador no encontrado' })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Administrador eliminado' })
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message })
    };
  }
};
