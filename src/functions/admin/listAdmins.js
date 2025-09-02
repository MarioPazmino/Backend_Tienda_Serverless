const adminService = require('../../services/admin.service');
const { connect } = require('../../config.db');

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
    // Si quieres filtrar por el usuario autenticado:
    // 1. Decodifica el JWT del header Authorization
    // 2. Busca solo ese usuario
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    let filter = {};
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      if (payload && payload.username) {
        filter.username = payload.username;
      }
    }
  const admins = await adminService.find(filter);
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
