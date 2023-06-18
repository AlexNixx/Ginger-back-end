const brandService = require("../service/brandService");
const ApiErorr = require("../exceptions/api-error");

class categotyContoller {
	async create(req, res, next) {
		try {
			const { name } = req.body;
			const { photoUrl } = req.files;
			const brand = await brandService.create(name, photoUrl);
			return res.json(brand);
		} catch (error) {
			next(error);
		}
	}

	async getAll(req, res, next) {
		try {
			const { limit } = req.query;
			console.log(limit);
			const brands = await brandService.getAll();
			return res.json(brands);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new categotyContoller();
