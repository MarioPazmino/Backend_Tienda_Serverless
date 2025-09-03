const { connect } = require('../../config.db');
const adminService = require('../../services/admin.service');
const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');

module.exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'PUT,OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  try {
    await connect();
    const { id } = event.pathParameters;
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

    // Validación con Joi: username y/o password opcionales
    const schema = Joi.object({
      username: Joi.string().alphanum().min(3).max(30).optional(),
      password: Joi.string().min(6).max(100).optional(),
      role: Joi.string().valid('admin','superadmin').optional()
    }).or('username','password','role');

    const { error, value } = schema.validate(body);
    if (error) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: error.details[0].message })
      };
    }

    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: 'No autorizado' }) };
    }
    const token = authHeader.slice(7);
    let payload;
    try {
      payload = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: 'Token inválido' }) };
    }

    // Admins can only update their own record; superadmin can update anyone
    if (payload.role === 'admin' && payload.id !== id) {
      return { statusCode: 403, headers: corsHeaders, body: JSON.stringify({ error: 'No tienes permiso para editar este administrador' }) };
    }

    // If admin attempts to set role to superadmin, forbid
    if (value.role === 'superadmin' && payload.role !== 'superadmin') {
      return { statusCode: 403, headers: corsHeaders, body: JSON.stringify({ error: 'No puedes asignar rol superadmin' }) };
    }

    // Sanitizar campos
    const fields = {};
    if (value.username) fields.username = sanitizeHtml(value.username);
    if (value.password) fields.password = sanitizeHtml(value.password);
    if (value.role) fields.role = value.role;

    const updated = await adminService.updateAdmin(id, fields);
    if (!updated) {
      return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ error: 'Administrador no encontrado' }) };
    }

    return { statusCode: 200, headers: Object.assign({ 'Content-Type': 'application/json' }, corsHeaders), body: JSON.stringify({ message: 'Administrador actualizado', admin: updated }) };
  } catch (err) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: err.message }) };
  }
};
