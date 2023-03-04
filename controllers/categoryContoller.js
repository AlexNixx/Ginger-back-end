const categotyService = require("../service/categotyService");
const ApiErorr = require("../exceptions/api-error");

class categotyContoller {
	async create(req, res, next) {
		try {
			const { name } = req.body;
			const category = await categotyService.create(name);
			return res.json(category);
		} catch (error) {
			next(error);
		}
	}

	async getAll(req, res, next) {
		try {
			const categories = await categotyService.getAll();
			return res.json(categories);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new categotyContoller();
