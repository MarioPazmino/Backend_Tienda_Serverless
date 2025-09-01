const { connect } = require('../../config.db');
const adminService = require('../../services/admin.service');
const jwt = require('jsonwebtoken');

module.exports.handler = async (event) => {
  try {
    await connect();
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { username, password } = body;
    const admin = await adminService.login(username, password);
    if (!admin) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Credenciales inválidas' })
      };
    }
    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return {
      statusCode: 200,
      body: JSON.stringify({ token })
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message })
    };
  }
};
