
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
      activo: Joi.boolean().required()
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

    if (payload.role !== 'superadmin') {
      return { statusCode: 403, body: JSON.stringify({ error: 'Solo superadmin puede cambiar activo' }) };
    }

    // Sanitizar id
    const cleanId = sanitizeHtml(id);

    const updated = await adminService.setActive(cleanId, value.activo);
    if (!updated) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Administrador no encontrado' })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Administrador ${value.activo ? 'habilitado' : 'deshabilitado'}` })
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message })
    };
  }
};
