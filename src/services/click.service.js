const clickRepository = require('../repositories/click.repository');

class ClickService {
    async registerClick(data) {
        return clickRepository.create(data);
    }
    async getStats(filter = {}) {
        return clickRepository.getStats(filter);
    }
    async countByProduct() {
        return clickRepository.countByProduct();
    }
}

module.exports = new ClickService();
