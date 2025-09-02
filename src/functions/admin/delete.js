
const { connect } = require('../../config.db');
const adminService = require('../../services/admin.service');
const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');

module.exports.handler = async (event) => {
  try {
    await connect();
    const { id } = event.pathParameters;

    const schema = Joi.object({ id: Joi.string().required() });
    const { error, value } = schema.validate({ id });
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

    // Fetch target admin to inspect role
    const cleanId = sanitizeHtml(value.id);
    const targets = await adminService.find({ _id: cleanId });
    const target = Array.isArray(targets) ? targets[0] : targets;
    if (!target) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Administrador no encontrado' }) };
    }

    // If requester is admin and target is superadmin -> forbidden
    if (payload.role === 'admin' && target.role === 'superadmin') {
      return { statusCode: 403, body: JSON.stringify({ error: 'No puedes eliminar a un superadmin' }) };
    }

    // Else allow deletion (admins can delete other admins too)
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
