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
			const query = req.query;
			const colors = await colorService.getAll(query);
			return res.json(colors);
		} catch (error) {
			next(error);
		}
	}

	async getOne(req, res, next) {
		try {
			const color = await colorService.getOne(req.params.id);
			return res.json(color);
		} catch (error) {
			next(error);
		}
	}

	async updateColor(req, res, next) {
		try {
			const color = await colorService.updateColor(req.params.id, req.body);

			return res.json(color);
		} catch (error) {
			next(error);
		}
	}

	async deleteColor(req, res, next) {
		try {
			const color = await colorService.deleteColor(req.params.id);

			return res.json(color);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new colorController();
