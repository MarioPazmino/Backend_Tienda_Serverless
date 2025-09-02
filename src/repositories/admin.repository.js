const Admin = require('../models/admin.model');

class AdminRepository {
    async findByUsername(username) {
        return Admin.findOne({ username });
    }

    async create({ username, password, role = 'admin' }) {
        const admin = new Admin({ username, password, role });
        await admin.save();
        // return without password
        const result = admin.toObject();
        delete result.password;
        return result;
    }

    async find(filter = {}) {
        // Excluir password por seguridad
        return Admin.find(filter).select('-password').lean();
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

    async updatePassword(id, newPassword) {
        const admin = await Admin.findById(id);
        if (!admin) return null;
        admin.password = newPassword;
        await admin.save();
        return admin;
    }
}

module.exports = new AdminRepository();
