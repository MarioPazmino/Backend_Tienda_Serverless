const { connect } = require('../../config.db');
const adminService = require('../../services/admin.service');

module.exports.handler = async (event) => {
  try {
    await connect();
    const { id } = event.pathParameters;
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { activo } = body;
    if (typeof activo !== 'boolean') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'El campo activo debe ser booleano.' })
      };
    }
    const updated = await adminService.setActive(id, activo);
    if (!updated) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Administrador no encontrado' })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Administrador ${activo ? 'habilitado' : 'deshabilitado'}` })
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message })
    };
  }
};
