const adminService = require('../../services/admin.service');
const { connect } = require('../../config.db');
const jwt = require('jsonwebtoken');

module.exports.handler = async (event) => {
  // Cabeceras CORS consistentes
  const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,OPTIONS'
  };

  // Responder preflight OPTIONS rápido
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
  // Asegurar conexión a la base de datos
  await connect();
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    let filter = {};
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // DEBUG: log payload (no token) to CloudWatch for diagnosis - remove after debugging
        console.log('listAdmins - decoded payload:', payload);
        if (payload && payload.role === 'admin') {
          // Admins can see all admins except superadmins
          filter = { role: { $ne: 'superadmin' } };
        }
        // if superadmin, keep filter empty to return all
      } catch (e) {
        console.error('listAdmins - token verify failed', e && e.message);
        return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: 'Token inválido' }) };
      }
    } else {
      return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: 'No autorizado' }) };
    }

    const admins = await adminService.find(filter);
    // DEBUG: log the result count and ids to help debug filtering issues (temporary)
    try {
      const ids = Array.isArray(admins) ? admins.map(a => a._id || a.id).slice(0, 20) : [];
      console.log('listAdmins - filter:', filter, 'returned count:', Array.isArray(admins) ? admins.length : 0, 'ids:', ids);
    } catch (logErr) {
      console.error('listAdmins - debug log failed', logErr && logErr.message);
    }
    return {
      statusCode: 200,
      headers: Object.assign({ 'Content-Type': 'application/json' }, corsHeaders),
      body: JSON.stringify(admins)
    };
  } catch (err) {
  console.error('listAdmins error:', err);
    return {
      statusCode: 500,
      headers: Object.assign({ 'Content-Type': 'application/json' }, corsHeaders),
      body: JSON.stringify({ error: err.message })
    };
  }
};
