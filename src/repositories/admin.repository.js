const Admin = require('../models/admin.model');

class AdminRepository {
    async findByUsername(username) {
        return Admin.findOne({ username });
    }

    async setActive(id, activo) {
        return Admin.findByIdAndUpdate(id, { activo }, { new: true });
    }

    async setFechaExpiracion(id, fechaExpiracion) {
        return Admin.findByIdAndUpdate(id, { fechaExpiracion }, { new: true });
    }

    async delete(id) {
        return Admin.findByIdAndDelete(id);
    }
}

module.exports = new AdminRepository();
