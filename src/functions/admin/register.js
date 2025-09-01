const { connect } = require('../../config.db');
const adminService = require('../../services/admin.service');

module.exports.handler = async (event) => {
  try {
    await connect();
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { username, password } = body;
    if (!username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Username y password son requeridos' })
      };
    }
    const admin = await adminService.register({ username, password });
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Administrador registrado', admin: { username: admin.username, id: admin._id } })
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message })
    };
  }
};
