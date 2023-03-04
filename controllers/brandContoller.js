const brandService = require("../service/brandService");
const ApiErorr = require("../exceptions/api-error");

class categotyContoller {
	async create(req, res, next) {
		try {
			const { name } = req.body;
			const brand = await brandService.create(name);
			return res.json(brand);
		} catch (error) {
			next(error);
		}
	}

	async getAll(req, res, next) {
		const brands = await brandService.getAll();
		return res.json(brands);
		try {
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new categotyContoller();
