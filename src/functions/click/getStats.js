const { connect } = require('../../config.db');
const clickService = require('../../services/click.service');

module.exports.handler = async (event) => {
  try {
    await connect();
    const stats = await clickService.getStats(event.queryStringParameters || {});
    return {
      statusCode: 200,
      body: JSON.stringify(stats)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
