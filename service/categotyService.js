const ApiError = require("../exceptions/api-error");
const uuid = require("uuid");
const path = require("path");

const CategoryModel = require("../models/categoty-model");

class categotyService {
	async create(name, photoUrl) {
		let photoName = uuid.v4() + ".jpg";
		photoUrl.mv(path.resolve(__dirname, "..", "static", photoName));
		const category = await CategoryModel.create({
			name,
			photoUrl: photoName,
		});

		return {
			category,
		};
	}

	async getAll({ page, limit }) {
		if (!limit || !page) {
			const categories = await CategoryModel.find();
			const totalCategories = categories.length;
			return { categories, currentPage: 1, totalPages: 1, totalCategories };
		}

		// pagination
		const skip = (page - 1) * limit;
		const totalCategories = await CategoryModel.countDocuments();
		const totalPages = Math.ceil(totalCategories / limit);

		const categories = await CategoryModel.find().skip(skip).limit(limit);

		return { categories, currentPage: page, totalPages, totalCategories };
	}

	async getOne(id) {
		const category = await CategoryModel.findById(id);

		if (!category) {
			throw ApiError.BadRequests("Category not found");
		}

		return category;
	}

	async updateCategory(categoryId, body, files) {
		const { name } = body;

		let photoName; // Initialize photoName to null

		if (files?.photoUrl) {
			// Check if req.files exists and contains the photoUrl property
			const { photoUrl } = files;
			photoName = uuid.v4() + ".jpg";
			photoUrl.mv(path.resolve(__dirname, "..", "static", photoName));
		}

		const updateData = {
			name,
			photoUrl: photoName,
		};

		const category = await CategoryModel.findByIdAndUpdate(
			categoryId,
			updateData,
			{
				new: true, // Return the updated product instead of the old one
				runValidators: true, // Run model validators on update
			}
		);

		return {
			category,
		};
	}

	async deleteCategory(categoryId) {
		const category = await CategoryModel.findByIdAndDelete(categoryId);

		if (!category) {
			throw ApiError.BadRequests("Category not found");
		}
		return category;
	}
}

module.exports = new categotyService();
