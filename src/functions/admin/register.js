
const { connect } = require('../../config.db');
const adminService = require('../../services/admin.service');
const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');

module.exports.handler = async (event) => {
  try {
    await connect();
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

    // Validación con Joi
    const schema = Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required(),
      password: Joi.string().min(6).max(100).required()
    });
    const { error, value } = schema.validate(body);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.details[0].message })
      };
    }

    // Sanitizar username
    value.username = sanitizeHtml(value.username);

    const admin = await adminService.register({ username: value.username, password: value.password });
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
