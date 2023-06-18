const ApiError = require("../exceptions/api-error");
const uuid = require("uuid");
const path = require("path");

const BrandModel = require("../models/brand-model");

class brandService {
	async create(name, photoUrl) {
		let photoName = uuid.v4() + ".jpg";
		photoUrl.mv(path.resolve(__dirname, "..", "static", photoName));

		const brand = await BrandModel.create({
			name,
			photoUrl: photoName,
		});

		return {
			brand,
		};
	}

	async getAll() {
		const brands = await BrandModel.find();
		return brands;
	}
}

module.exports = new brandService();
