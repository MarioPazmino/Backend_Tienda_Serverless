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
}

module.exports = new AdminService();
