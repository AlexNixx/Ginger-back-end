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

	async getAll({ page, limit }) {
		if (!limit || !page) {
			const brands = await BrandModel.find();
			const totalBrands = brands.length;
			return { brands, currentPage: 1, totalPages: 1, totalBrands };
		}

		// pagination
		const skip = (page - 1) * limit;
		const totalBrands = await BrandModel.countDocuments();
		const totalPages = Math.ceil(totalBrands / limit);

		const brands = await BrandModel.find().skip(skip).limit(limit);

		return { brands, currentPage: page, totalPages, totalBrands };
	}

	async getOne(id) {
		const brand = await BrandModel.findById(id);

		if (!brand) {
			throw ApiError.BadRequests("Brand not found");
		}

		return brand;
	}

	async updateBrand(brandId, body, files) {
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

		const brand = await BrandModel.findByIdAndUpdate(brandId, updateData, {
			new: true, // Return the updated product instead of the old one
			runValidators: true, // Run model validators on update
		});

		return {
			brand,
		};
	}

	async deleteBrand(brandId) {
		const brand = await BrandModel.findByIdAndDelete(brandId);

		if (!brand) {
			throw ApiError.BadRequests("Brand not found");
		}

		return brand;
	}
}

module.exports = new brandService();
