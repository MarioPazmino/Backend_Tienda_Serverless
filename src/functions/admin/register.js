
const { connect } = require('../../config.db');
const adminService = require('../../services/admin.service');
const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');
const jwt = require('jsonwebtoken');

module.exports.handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };

  try {
    await connect();

    // Verificar autorización: solo superadmin puede crear otros admins
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: 'No autorizado' }) };
    }
    const token = authHeader.split(' ')[1];
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: 'Token inválido' }) };
    }
    if (!payload || (payload.role !== 'superadmin' && payload.role !== 'admin')) {
      return { statusCode: 403, headers: corsHeaders, body: JSON.stringify({ error: 'Se requieren permisos de admin o superadmin' }) };
    }

    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

    // Validación con Joi
    const schema = Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required(),
      password: Joi.string().min(6).max(100).required(),
      role: Joi.string().valid('admin','superadmin').optional()
    });
    const { error, value } = schema.validate(body);
    if (error) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: error.details[0].message })
      };
    }

    // Sanitizar username
    value.username = sanitizeHtml(value.username);

    // Validar roles: si el creador es 'admin', solo puede crear role: 'admin'
    const creatorRole = payload.role;
    const requestedRole = value.role || 'admin';
    if (requestedRole === 'superadmin' && creatorRole !== 'superadmin') {
      return { statusCode: 403, headers: corsHeaders, body: JSON.stringify({ error: 'Solo superadmin puede crear superadmin' }) };
    }

    // Crear admin (service -> repository)
    const admin = await adminService.register({ username: value.username, password: value.password, role: requestedRole });
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Administrador registrado', admin: { username: admin.username, id: admin._id, role: admin.role } })
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message })
    };
  }
};
