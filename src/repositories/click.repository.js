const Click = require('../models/click.model');

class ClickRepository {
    async create(data) {
        return Click.create(data);
    }
    async getStats(filter = {}) {
        return Click.find(filter);
    }
    async countByProduct() {
        return Click.aggregate([
            { $match: { productId: { $ne: null } } },
            { $group: { _id: '$productId', count: { $sum: 1 } } }
        ]);
    }
}

module.exports = new ClickRepository();
