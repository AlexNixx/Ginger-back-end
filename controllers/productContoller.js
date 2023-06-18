const productService = require("../service/productService");
const ApiErorr = require("../exceptions/api-error");

class productContoller {
	async create(req, res, next) {
		try {
			const { title, price, category, brand, color, inStock, deviceInfo } =
				req.body;

			const { photoUrl } = req.files;

			const deviceData = await productService.create(
				title,
				price,
				category,
				brand,
				color,
				inStock,
				deviceInfo,
				photoUrl
			);

			return res.json(deviceData);
		} catch (error) {
			next(error);
		}
	}

	async getAll(req, res, next) {
		try {
			const query = req.query;
			const products = await productService.getAll(query);
			return res.json(products);
		} catch (error) {
			next(error);
		}
	}

	async getOne(req, res, next) {
		try {
			const product = await productService.getOne(req.params.id);
			return res.json(product);
		} catch (error) {
			next(error);
		}
	}

	async createReview(req, res, next) {
		try {
			const { rating, comment } = req.body;
			const productId = req.params.id;
			const userId = req.user.id;
			const name = req.user.name + " " + req.user.surname;
			const review = await productService.createReview(
				name,
				rating,
				comment,
				productId,
				userId
			);

			return res.json(review);
		} catch (error) {
			next(error);
		}
	}

	async deleteReview(req, res, next) {
		try {
			const productId = req.params.id;
			const reviewId = req.params.reviewId;
			const userId = req.user.id;
			const review = await productService.deleteReview(
				productId,
				reviewId,
				userId
			);

			return res.json(review);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new productContoller();
