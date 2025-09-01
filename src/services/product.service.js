const productRepository = require('../repositories/product.repository');

class ProductService {
    async getAllProducts(query) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const filters = {};
        if (query.name) filters.name = query.name;
        if (query.categoria) filters.categoria = query.categoria;
        if (query.destacado !== undefined) filters.destacado = query.destacado === 'true';
        if (query.minPrice) filters.minPrice = parseFloat(query.minPrice);
        if (query.maxPrice) filters.maxPrice = parseFloat(query.maxPrice);
        return productRepository.findAll({ page, limit, filters });
    }
    async getProductById(id) {
        return productRepository.findById(id);
    }
    async createProduct(data) {
        return productRepository.create(data);
    }
    async updateProduct(id, data) {
        return productRepository.update(id, data);
    }
    async deleteProduct(id) {
        return productRepository.delete(id);
    }
}

module.exports = new ProductService();
