const Admin = require('../models/admin.model');

class AdminRepository {
    async findByUsername(username) {
        return Admin.findOne({ username });
    }
}

module.exports = new AdminRepository();
