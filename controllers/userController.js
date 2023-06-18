const userService = require("../service/userService");

const ApiErorr = require("../exceptions/api-error");

class userController {
	async singUp(req, res, next) {
		try {
			const { name, surname, email, password } = req.body;
			const userData = await userService.singUp(name, surname, email, password);
			res.cookie("refreshToken", userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				secure: true,
				domain:
					process.env.NODE_ENV === "development" ? "localhost" : "vercel.app",
			});
			return res.json(userData);
		} catch (error) {
			next(error);
		}
	}

	async singIn(req, res, next) {
		try {
			const { email, password } = req.body;
			const userData = await userService.singIn(email, password);
			res.cookie("refreshToken", userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				secure: true,
				domain:
					process.env.NODE_ENV === "development" ? "localhost" : "vercel.app",
			});
			return res.json(userData);
		} catch (error) {
			next(error);
		}
	}

	async updatePassword(req, res, next) {
		try {
			const userId = req.user._id;
			const { password, newPassword } = req.body;
			const userData = await userService.updatePassword(
				userId,
				password,
				newPassword
			);

			return res.json(userData);
		} catch (error) {
			next(error);
		}
	}

	async addUserAddress(req, res, next) {
		try {
			const userId = req.user._id;
			const { city, address, postalCode, country } = req.body;
			const userData = await userService.addUserAddress(
				userId,
				city,
				address,
				postalCode,
				country
			);

			return res.json(userData);
		} catch (error) {
			next(error);
		}
	}

	async logout(req, res, next) {
		try {
			const { refreshToken } = req.cookies;
			const token = await userService.logout(refreshToken);
			res.clearCookie("refreshToken");
			return res.json(token);
		} catch (error) {
			next(error);
		}
	}

	async activate(req, res, next) {
		try {
			const activationLink = req.params.link;
			await userService.activate(activationLink);
			return res.redirect(process.env.CLIENT_URL);
		} catch (error) {
			next(error);
		}
	}

	async refresh(req, res, next) {
		try {
			const { refreshToken } = req.cookies;
			const userData = await userService.refresh(refreshToken);
			res.cookie("refreshToken", userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});
			return res.json(userData);
		} catch (error) {
			next(error);
		}
	}

	async getRole(req, res, next) {
		try {
			const { role } = req.user;
			console.log("role: " + role);
			return res.json(role);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new userController();
