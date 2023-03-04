const ApiError = require("../exceptions/api-error");

const ColorModel = require("../models/color-model");

class colorService {
	async create(name, rgb) {
		const data = await ColorModel.create({
			name,
			rgb,
		});

		return {
			data,
		};
	}

	async getAll() {
		const colors = await ColorModel.find();
		return colors;
	}
}

module.exports = new colorService();
