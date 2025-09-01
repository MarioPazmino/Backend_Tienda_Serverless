const adminRepository = require('../../services/admin.service');

class AdminRegisterService {
    async register({ username, password }) {
        // Reutiliza el repositorio existente
        return adminRepository.register({ username, password });
    }
}

module.exports = new AdminRegisterService();
