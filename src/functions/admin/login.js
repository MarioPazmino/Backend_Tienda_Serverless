
const { connect } = require('../../config.db');
const adminService = require('../../services/admin.service');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');

module.exports.handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
    "Access-Control-Allow-Credentials": true
  };
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
        headers: corsHeaders,
        body: JSON.stringify({ error: error.details[0].message })
      };
    }

    // Sanitizar username
    value.username = sanitizeHtml(value.username);

    const admin = await adminService.login(value.username, value.password);
    if (!admin) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Credenciales inválidas' })
      };
    }
    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ token })
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message })
    };
  }
};
