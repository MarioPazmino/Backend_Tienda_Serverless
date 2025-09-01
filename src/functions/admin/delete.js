const { connect } = require('../../config.db');
const adminService = require('../../services/admin.service');

module.exports.handler = async (event) => {
  try {
    await connect();
    const { id } = event.pathParameters;
    const deleted = await adminService.delete(id);
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
