const colorService = require("../service/colorService");
const ApiErorr = require("../exceptions/api-error");

class colorController {
	async create(req, res, next) {
		try {
			const { name, rgb } = req.body;
			const data = await colorService.create(name, rgb);
			return res.json(data);
		} catch (error) {
			next(error);
		}
	}

	async getAll(req, res, next) {
		try {
			const colors = await colorService.getAll();
			return res.json(colors);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new colorController();
