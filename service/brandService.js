const ApiError = require("../exceptions/api-error");

const BrandModel = require("../models/brand-model");

class brandService {
	async create(name) {
		const product = await BrandModel.create({
			name,
		});

		return {
			product,
		};
	}

	async getAll() {
		const brands = await BrandModel.find();
		return brands;
	}
}

module.exports = new brandService();
