const ApiError = require("../exceptions/api-error");
const uuid = require("uuid");
const path = require("path");

const ProductModel = require("../models/product-model");

class productService {
	async create(
		title,
		price,
		category,
		brand,
		color,
		inStock,
		deviceInfo,
		photoUrl
	) {
		let photoName = uuid.v4() + ".jpg";
		photoUrl.mv(path.resolve(__dirname, "..", "static", photoName));

		const info = JSON.parse(deviceInfo);
		console.log(deviceInfo);
		console.log(info);

		const deviceInfoArray = info.map((item) => ({
			title: item.title,
			description: item.description,
		}));

		// console.log(deviceInfoArray);

		const product = await ProductModel.create({
			title,
			price,
			category,
			brand,
			color,
			inStock,
			deviceInfo: info,
			photoUrl: photoName,
		});

		return {
			product,
		};
	}

	async getAll(query) {
		const { categories, brands, minPrice, maxPrice, slug } = query;

		const filter = {};

		if (categories) {
			const categoriesArr = categories
				.split(",")
				.map((category) => ({ category }));
			filter.$or = categoriesArr;
		}
		if (brands) {
			const brandsArr = brands.split(",").map((brand) => ({ brand }));
			filter.$or = brandsArr;
		}

		if (minPrice && maxPrice) {
			filter.price = { $gte: minPrice, $lte: maxPrice };
		} else if (minPrice) {
			filter.price = { $gte: minPrice };
		} else if (maxPrice) {
			filter.price = { $lte: maxPrice };
		}

		if (slug) {
			filter.$or = [{ title: new RegExp(slug, "i") }];
		}

		const products = await ProductModel.find(filter)
			.populate("category", "name")
			.populate("brand", "name")
			.populate("color");
		return products;
	}

	async getOne(id) {
		const product = await ProductModel.findById(id)
			.populate("category", "name")
			.populate("brand", "name")
			.populate("color");
		return product;
	}
}

module.exports = new productService();
