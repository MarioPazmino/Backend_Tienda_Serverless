const { connect } = require('../../config.db');
const adminService = require('../../services/admin.service');

module.exports.handler = async (event) => {
  try {
    await connect();
    // Aquí deberías obtener el id del admin autenticado del token JWT
    // Por simplicidad, se asume que viene en el body (ajusta según tu autenticación real)
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { id, newPassword } = body;
    if (!newPassword || newPassword.length < 6) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'La nueva contraseña debe tener al menos 6 caracteres.' })
      };
    }
    await adminService.changePassword(id, newPassword);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Contraseña actualizada correctamente.' })
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message })
    };
  }
};
