
const { connect } = require('../../config.db');
const adminService = require('../../services/admin.service');
const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');

module.exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
  };

  const makeResponse = (statusCode, body) => ({ statusCode, headers: corsHeaders, body: JSON.stringify(body) });

  try {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: corsHeaders, body: '' };
    await connect();
    const { id } = event.pathParameters;

    const schema = Joi.object({ id: Joi.string().required() });
    const { error, value } = schema.validate({ id });
    if (error) {
      return makeResponse(400, { error: error.details[0].message });
    }

    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return makeResponse(401, { error: 'No autorizado' });
    }
    const token = authHeader.slice(7);
    let payload;
    try {
      payload = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return makeResponse(401, { error: 'Token inválido' });
    }

    // Fetch target admin to inspect role
    const cleanId = sanitizeHtml(value.id);
    const targets = await adminService.find({ _id: cleanId });
    const target = Array.isArray(targets) ? targets[0] : targets;
    if (!target) {
      return makeResponse(404, { error: 'Administrador no encontrado' });
    }

    // If requester is admin and target is superadmin -> forbidden
    if (payload.role === 'admin' && target.role === 'superadmin') {
      return makeResponse(403, { error: 'No puedes eliminar a un superadmin' });
    }

    // Else allow deletion (admins can delete other admins too)
    const deleted = await adminService.delete(cleanId);
    if (!deleted) {
      return makeResponse(404, { error: 'Administrador no encontrado' });
    }
    return makeResponse(200, { message: 'Administrador eliminado' });
  } catch (err) {
    return makeResponse(400, { error: err.message });
  }
};
