const brandService = require("../service/brandService");
const ApiErorr = require("../exceptions/api-error");

class brandContoller {
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
			const query = req.query;
			const brands = await brandService.getAll(query);

			return res.json(brands);
		} catch (error) {
			next(error);
		}
	}

	async getOne(req, res, next) {
		try {
			const brand = await brandService.getOne(req.params.id);

			return res.json(brand);
		} catch (error) {
			next(error);
		}
	}

	async updateBrand(req, res, next) {
		try {
			const brand = await brandService.updateBrand(
				req.params.id,
				req.body,
				req.files
			);

			return res.json(brand);
		} catch (error) {
			next(error);
		}
	}

	async deleteBrand(req, res, next) {
		try {
			const brand = await brandService.deleteBrand(req.params.id);

			return res.json(brand);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new brandContoller();
