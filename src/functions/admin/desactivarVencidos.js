const { connect } = require('../../config.db');
const Admin = require('../../models/admin.model');

module.exports.handler = async () => {
  try {
    await connect();
    const hoy = new Date();
    const result = await Admin.updateMany(
      {
        rol: 'admin',
        activo: true,
        fechaExpiracion: { $lte: hoy }
      },
      { $set: { activo: false } }
    );
    return {
      statusCode: 200,
      body: JSON.stringify({ desactivados: result.modifiedCount })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
