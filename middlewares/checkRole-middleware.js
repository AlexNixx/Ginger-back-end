const jwt = require("jsonwebtoken");
const ApiErorr = require("../exceptions/api-error");

module.exports = function (role) {
	return function (req, res, next) {
		if (req.method === "OPTIONS") {
			next();
		}
		try {
			const authorizationHeader = req.headers.authorization;
			if (!authorizationHeader) {
				return next(ApiErorr.UnautorizedError());
			}

			const accessToken = authorizationHeader.split(" ")[1];
			const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
			if (decoded.role !== role) {
				return next(ApiErorr.Forbidden());
				console.log("нет доступа");
			}

			next();
		} catch (error) {
			return next(ApiErorr.UnautorizedError());
		}
	};
};
