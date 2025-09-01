const { connect } = require('../../config.db');
const clickService = require('../../services/click.service');

module.exports.handler = async (event) => {
  try {
    await connect();
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const data = { productId: body.productId };
    const click = await clickService.registerClick(data);
    return {
      statusCode: 201,
      body: JSON.stringify(click)
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message })
    };
  }
};
