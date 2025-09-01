const { connect } = require('../../config.db');
const adminService = require('../../services/admin.service');

module.exports.handler = async (event) => {
  try {
    await connect();
    const { id } = event.pathParameters;
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { fechaExpiracion } = body;
    if (!fechaExpiracion) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'La fecha de expiración es requerida.' })
      };
    }
    const updated = await adminService.setFechaExpiracion(id, fechaExpiracion);
    if (!updated) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Administrador no encontrado' })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Fecha de expiración actualizada', fechaExpiracion: updated.fechaExpiracion })
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message })
    };
  }
};
