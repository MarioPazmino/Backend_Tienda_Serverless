const adminRepository = require('../repositories/admin.repository');

class AdminService {
    async login(username, password) {
        const admin = await adminRepository.findByUsername(username);
        if (!admin) return null;
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) return null;
        return admin;
    }

    async register({ username, password }) {
        return adminRepository.create({ username, password });
    }

    async setActive(id, activo) {
        return adminRepository.setActive(id, activo);
    }

    async setFechaExpiracion(id, fechaExpiracion) {
        return adminRepository.setFechaExpiracion(id, fechaExpiracion);
    }

    async delete(id) {
        return adminRepository.delete(id);
    }
    
    async changePassword(id, newPassword) {
        return adminRepository.updatePassword(id, newPassword);
    }

    async find(filter = {}) {
        return adminRepository.find(filter);
    }
}

module.exports = new AdminService();
