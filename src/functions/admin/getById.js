const adminService = require('../../services/admin.service');
const { connect } = require('../../config.db');
const jwt = require('jsonwebtoken');

module.exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  try {
    await connect();
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: 'No autorizado' }) };
    }

    const token = authHeader.slice(7);
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: 'Token inválido' }) };
    }

    const id = event.pathParameters && (event.pathParameters.id || event.pathParameters.ID || event.pathParameters._id);
    if (!id) return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'ID requerido' }) };

    const results = await adminService.find({ _id: id });
    const admin = Array.isArray(results) ? results[0] : results;
    if (!admin) return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ error: 'Administrador no encontrado' }) };

    // RBAC: superadmin can view any; admin cannot view superadmin accounts
    if (payload && payload.role === 'admin' && admin.role === 'superadmin') {
      return { statusCode: 403, headers: corsHeaders, body: JSON.stringify({ error: 'Prohibido' }) };
    }

    return { statusCode: 200, headers: Object.assign({ 'Content-Type': 'application/json' }, corsHeaders), body: JSON.stringify(admin) };
  } catch (err) {
    console.error('getAdminById error:', err);
    return { statusCode: 500, headers: Object.assign({ 'Content-Type': 'application/json' }, corsHeaders), body: JSON.stringify({ error: err.message }) };
  }
};
