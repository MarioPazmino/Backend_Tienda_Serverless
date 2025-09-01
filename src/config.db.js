const mongoose = require('mongoose');

let conn = null;

module.exports.connect = async () => {
  if (conn == null) {
    conn = await mongoose.connect(process.env.MONGODB_URI);
  }
  return conn;
};
