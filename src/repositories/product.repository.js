const Product = require('../models/product.model');

class ProductRepository {
    async create(data) {
        return Product.create(data);
    }
    async findAll({ page = 1, limit = 10, filters = {} }) {
        const skip = (page - 1) * limit;
        const query = {};
        if (filters.name) query.name = { $regex: filters.name, $options: 'i' };
        if (filters.categoria) query.categoria = filters.categoria;
        if (filters.destacado !== undefined) query.destacado = filters.destacado;
        if (filters.minPrice || filters.maxPrice) {
            query.price = {};
            if (filters.minPrice) query.price.$gte = filters.minPrice;
            if (filters.maxPrice) query.price.$lte = filters.maxPrice;
        }
        const [products, total] = await Promise.all([
            Product.find(query).skip(skip).limit(limit),
            Product.countDocuments(query)
        ]);
        return {
            products,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
    async findById(id) {
        return Product.findById(id);
    }
    async update(id, data) {
        return Product.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        return Product.findByIdAndDelete(id);
    }
}

module.exports = new ProductRepository();
