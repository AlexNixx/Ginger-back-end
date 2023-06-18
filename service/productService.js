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
		const {
			categories,
			brands,
			colors,
			minPrice,
			maxPrice,
			slug,
			sortBy,
			sortOrder,
			page = 1,
			limit = 12,
		} = query;

		// filtering
		const filter = {};

		if (categories) {
			const categoriesArr = categories.split(",");
			filter.category = { $in: categoriesArr };
		}

		if (brands) {
			const brandsArr = brands.split(",");
			filter.brand = { $in: brandsArr };
		}

		if (colors) {
			const colorsArr = colors.split(",");
			filter.color = { $in: colorsArr };
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

		// sorting
		let sort = {};
		if (sortBy === "name") {
			sort = { title: sortOrder === "asc" ? 1 : -1 };
		} else if (sortBy === "price") {
			sort = { price: sortOrder === "asc" ? 1 : -1 };
		}

		// pagination
		const skip = (page - 1) * limit;
		const totalProducts = await ProductModel.countDocuments(filter);
		const totalPages = Math.ceil(totalProducts / limit);

		const products = await ProductModel.find(filter)
			.populate("category", "name")
			.populate("brand", "name")
			.populate("color")
			.sort(sort)
			.skip(skip)
			.limit(limit);

		return {
			products,
			currentPage: page,
			totalPages,
			totalProducts,
		};
	}

	async getOne(id) {
		const product = await ProductModel.findById(id)
			.populate("category", "name")
			.populate("brand", "name")
			.populate("color");

		if (!product) {
			console.log("PRODUCT NOT FOUND");
			throw ApiError.BadRequests("Product not found");
		}

		return product;
	}

	async createReview(name, rating, comment, productId, userId) {
		const product = await ProductModel.findById(productId);

		if (!product) {
			throw ApiError.BadRequests("Product not found");
		}

		const alreadyReviewed = product.reviews.find(
			(r) => r.user.toString() === userId.toString()
		);

		if (alreadyReviewed) {
			throw ApiError.BadRequests("Product already reviewed");
		}

		const review = {
			name,
			rating: Number(rating),
			comment,
			user: userId,
		};

		product.reviews.push(review);
		product.nubReviews = product.reviews.length;

		product.rating =
			product.reviews.reduce((acc, review) => review.rating + acc, 0) /
			product.reviews.length;

		await product.save();
		return product;
	}

	async deleteReview(productId, reviewId, userId) {
		const product = await ProductModel.findById(productId);

		if (!product) {
			throw ApiError.BadRequests("Product not found");
		}

		const review = product.reviews.find(
			(r) =>
				r._id.toString() === reviewId.toString() &&
				r.user.toString() === userId.toString()
		);

		if (!review) {
			throw ApiError.BadRequests("Review not found or unauthorized");
		}

		product.reviews.remove(review);
		product.nubReviews = product.reviews.length;
		if (product.reviews.length > 0) {
			product.rating =
				product.reviews.reduce((acc, review) => review.rating + acc, 0) /
				product.reviews.length;
		} else {
			product.rating = 0;
		}

		await product.save();
		return product;
	}
}

module.exports = new productService();
