module.exports = class ApiError extends Error {
	status;
	errors;

	constructor(status, message, errors = []) {
		super(message);
		this.status = status;
		this.errors = errors;
	}

	static UnautorizedError() {
		return new ApiError(401, "unauthorized user");
	}

	static BadRequests(message, errors = []) {
		return new ApiError(400, message, errors);
	}

	static Forbidden() {
		return new ApiError(403, "Forbidden");
	}

	static ServerError() {
		return new ApiError(500, "Server Error");
	}
};
