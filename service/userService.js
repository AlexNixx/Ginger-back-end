const bcrypt = require("bcrypt");
const uuid = require("uuid");
const ApiError = require("../exceptions/api-error");

const UserModel = require("../models/user-model");

const mailService = require("./mailService");
const tokenService = require("./tokenService");

const UserDto = require("../dtos/user-dto");
const userModel = require("../models/user-model");

class userService {
	async singUp(email, password) {
		const candidate = await UserModel.findOne({ email });
		if (candidate) {
			throw ApiError.BadRequests(`user with email ${email} already exists`);
		}
		const hashPassword = await bcrypt.hash(password, 4);
		const activationLink = uuid.v4();

		const user = await UserModel.create({
			email,
			password: hashPassword,
			activationLink,
		});
		await mailService.sendActivationMail(
			email,
			`${process.env.API_URL}/api/user/activate/${activationLink}`
		);

		const userDto = new UserDto(user); //id, email, isActivated, role
		const tokens = tokenService.generateTokens({ ...userDto });
		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDto,
		};
	}

	async singIn(email, password) {
		const user = await UserModel.findOne({ email });
		if (!user) {
			throw ApiError.BadRequests(
				`the user with the email ${email} is not registered`
			);
		}
		const isPassEquals = await bcrypt.compare(password, user.password);
		if (!isPassEquals) {
			throw ApiError.BadRequests("Incorrect password");
		}

		const userDto = new UserDto(user); //id, email, isActivated, role
		const tokens = tokenService.generateTokens({ ...userDto });
		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDto,
		};
	}

	async logout(refreshToken) {
		const token = await tokenService.removeToken(refreshToken);
		return token;
	}

	async activate(activationLink) {
		const user = await userModel.findOne({ activationLink });
		if (!user) {
			throw ApiError.BadRequests("invalid link");
		}
		user.isActivated = true;
		await user.save();
	}

	async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.UnautorizedError();
		}
		const userData = tokenService.validateRefreshToken(refreshToken);
		const tokenFromDB = tokenService.findToken(refreshToken);
		if (!userData || !tokenFromDB) {
			throw ApiError.UnautorizedError();
		}
		const user = await userModel.findById(userData.id);
		const userDto = new UserDto(user); //id, email, isActivated, role
		const tokens = tokenService.generateTokens({ ...userDto });
		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDto,
		};
	}

	async getAllUsers() {
		const users = await userModel.find();
		return users;
	}
}

module.exports = new userService();
