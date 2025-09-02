
const { connect } = require('../../config.db');
const adminService = require('../../services/admin.service');
const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');

module.exports.handler = async (event) => {
  try {
    await connect();
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

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

    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { statusCode: 401, body: JSON.stringify({ error: 'No autorizado' }) };
    }
    const token = authHeader.slice(7);
    let payload;
    try {
      payload = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Token inválido' }) };
    }

    // If admin role, only allow changing own password
    if (payload.role === 'admin' && payload.id !== value.id) {
      return { statusCode: 403, body: JSON.stringify({ error: 'No tienes permiso para cambiar esta contraseña' }) };
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
