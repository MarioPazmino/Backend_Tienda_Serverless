
const { connect } = require('../../config.db');
const adminService = require('../../services/admin.service');
const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');

module.exports.handler = async (event) => {
  try {
    await connect();
    // Aquí deberías obtener el id del admin autenticado del token JWT
    // Por simplicidad, se asume que viene en el body (ajusta según tu autenticación real)
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

    // Validación con Joi
    const schema = Joi.object({
      id: Joi.string().required(),
      newPassword: Joi.string().min(6).max(100).required()
    });
    const { error, value } = schema.validate(body);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.details[0].message })
      };
    }

    // Sanitizar id (por si acaso)
    value.id = sanitizeHtml(value.id);

    await adminService.changePassword(value.id, value.newPassword);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Contraseña actualizada correctamente.' })
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message })
    };
  }
};
