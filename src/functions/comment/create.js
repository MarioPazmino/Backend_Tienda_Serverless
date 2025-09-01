const { connect } = require('../../config.db');
const commentService = require('../../services/comment.service');

module.exports.handler = async (event) => {
  try {
    await connect();
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const comment = await commentService.create(body);
    return {
      statusCode: 201,
      body: JSON.stringify(comment)
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message })
    };
  }
};
