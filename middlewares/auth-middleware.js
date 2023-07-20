const ApiErorr = require("../exceptions/api-error");
const tokenService = require("../service/tokenService");

module.exports = function (req, res, next) {
	try {
		const authorizationHeader = req.headers.authorization;
		if (!authorizationHeader) {
			return next(ApiErorr.UnautorizedError());
		}

		const accessToken = authorizationHeader.split(" ")[1];
		if (!accessToken) {
			return next(ApiErorr.UnautorizedError());
		}

		const userData = tokenService.validateAccessToken(accessToken);
		if (!userData) {
			return next(ApiErorr.UnautorizedError());
		}

		req.user = userData;

		next();
	} catch (error) {
		console.log(error);
		return next(ApiErorr.ServerError());
	}
};
