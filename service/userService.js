const bcrypt = require("bcrypt");
const uuid = require("uuid");
const ApiError = require("../exceptions/api-error");

const UserModel = require("../models/user-model");

const mailService = require("./mailService");
const tokenService = require("./tokenService");

const UserDto = require("../dtos/user-dto");

class userService {
	async singUp(name, surname, email, password) {
		const candidate = await UserModel.findOne({ email });
		if (candidate) {
			throw ApiError.BadRequests(`user with email ${email} already exists`);
		}
		const hashPassword = await bcrypt.hash(password, 10);
		const activationLink = uuid.v4();

		const user = await UserModel.create({
			name,
			surname,
			email,
			password: hashPassword,
			activationLink,
		});
		await mailService.sendActivationMail(
			email,
			`${process.env.API_URL}/api/user/activate/${activationLink}`
		);

		const userDto = new UserDto(user);
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

		const userDto = new UserDto(user);
		const tokens = tokenService.generateTokens({ ...userDto });
		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDto,
		};
	}

	async updatePassword(userId, password, newPassword) {
		const user = await UserModel.findOne(userId);
		if (!user) {
			throw ApiError.BadRequests("User not found");
		}
		const isPassEquals = await bcrypt.compare(password, user.password);
		if (!isPassEquals) {
			throw ApiError.BadRequests("Incorrect password");
		}

		// Update user's password
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUser = await UserModel.findByIdAndUpdate(user._id, {
			password: hashedPassword,
		});

		const userDto = new UserDto(updatedUser);

		return {
			user: userDto,
		};
	}

	async addUserAddress(userId, city, address, postalCode, country) {
		const user = await UserModel.findOne(userId);
		if (!user) {
			throw ApiError.BadRequests("User not found");
		}

		const updatedUser = await UserModel.findByIdAndUpdate(
			user._id,
			{
				address: {
					city,
					address,
					postalCode,
					country,
				},
			},
			{
				new: true,
			}
		);

		const userDto = new UserDto(updatedUser);

		return {
			user: userDto,
		};
	}

	async logout(refreshToken) {
		const token = await tokenService.removeToken(refreshToken);
		return token;
	}

	async activate(activationLink) {
		const user = await UserModel.findOne({ activationLink });
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
		const user = await UserModel.findById(userData.id);
		const userDto = new UserDto(user); //id, email, isActivated, role
		const tokens = tokenService.generateTokens({ ...userDto });
		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDto,
		};
	}

	async getAllUsers({ page, limit, userEmail }) {
		const query = {};

		if (!limit || !page) {
			throw ApiError.BadRequests("Missing parameters");
		}

		if (userEmail) {
			query.email = new RegExp(userEmail, "i");
		}

		// pagination
		const skip = (page - 1) * limit;
		const totalUsers = await UserModel.countDocuments(query);
		const totalPages = Math.ceil(totalUsers / limit);

		const users = await UserModel.find(query).skip(skip).limit(limit);
		const usersDto = users.map((user) => {
			const userDto = new UserDto(user);
			return {
				...userDto,
			};
		});

		return { users: usersDto, currentPage: page, totalPages, totalUsers };
	}

	async deleteUser(userId) {
		const user = await UserModel.findByIdAndDelete(userId);

		if (!user) {
			throw ApiError.BadRequests("User not found");
		}
		return user;
	}

	async updateUser(userId) {
		const user = await UserModel.findById(userId);

		if (!user) {
			throw ApiError.BadRequests("User not found");
		}

		if (user.role === "USER") {
			user.role = "ADMIN";
		} else {
			user.role = "USER";
		}

		await user.save();

		return user;
	}
}

module.exports = new userService();
