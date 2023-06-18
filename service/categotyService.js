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

	async getAll() {
		const categories = await CategoryModel.find();
		return categories;
	}
}

module.exports = new categotyService();
