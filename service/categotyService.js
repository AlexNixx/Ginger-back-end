const ApiError = require("../exceptions/api-error");

const CategoryModel = require("../models/categoty-model");

class categotyService {
	async create(name) {
		const category = await CategoryModel.create({
			name,
		});

		return {
			category,
		};
	}

	async getAll() {
		const categories = await CategoryModel.find();
		return categories;
	}
}

module.exports = new categotyService();
