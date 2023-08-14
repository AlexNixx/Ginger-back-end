const categotyService = require("../service/categotyService");
const ApiErorr = require("../exceptions/api-error");

class categotyContoller {
	async create(req, res, next) {
		try {
			const { name } = req.body;
			const { photoUrl } = req.files;
			const category = await categotyService.create(name, photoUrl);
			return res.json(category);
		} catch (error) {
			next(error);
		}
	}

	async getAll(req, res, next) {
		try {
			const query = req.query;
			const categories = await categotyService.getAll(query);
			return res.json(categories);
		} catch (error) {
			next(error);
		}
	}

	async getOne(req, res, next) {
		try {
			const product = await categotyService.getOne(req.params.id);
			return res.json(product);
		} catch (error) {
			next(error);
		}
	}

	async updateCategory(req, res, next) {
		try {
			const categoryData = await categotyService.updateCategory(
				req.params.id,
				req.body,
				req.files
			);

			return res.json(categoryData);
		} catch (error) {
			next(error);
		}
	}

	async deleteCategory(req, res, next) {
		try {
			const categoryId = req.params.id;
			const category = await categotyService.deleteCategory(categoryId);

			return res.json(category);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new categotyContoller();
