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

	async getAll({ page, limit }) {
		if (!limit || !page) {
			const colors = await ColorModel.find();
			const totalColors = categories.length;
			return { colors, currentPage: 1, totalPages: 1, totalColors };
		}

		// pagination
		const skip = (page - 1) * limit;
		const totalColors = await ColorModel.countDocuments();
		const totalPages = Math.ceil(totalColors / limit);

		const colors = await ColorModel.find().skip(skip).limit(limit);

		return { colors, currentPage: page, totalPages, totalColors };
	}

	async getOne(id) {
		const color = await ColorModel.findById(id);

		if (!color) {
			throw ApiError.BadRequests("Color not found");
		}

		return color;
	}

	async updateColor(colorId, body) {
		const { name, rgb } = body;

		const updateData = {
			name,
			rgb,
		};

		const color = await ColorModel.findByIdAndUpdate(colorId, updateData, {
			new: true, // Return the updated product instead of the old one
			runValidators: true, // Run model validators on update
		});

		return {
			color,
		};
	}

	async deleteColor(colorId) {
		const color = await ColorModel.findByIdAndDelete(colorId);

		if (!color) {
			throw ApiError.BadRequests("Color not found");
		}
		return color;
	}
}

module.exports = new colorService();
