// const orderService = require("../service/orderService");
const ApiError = require("../exceptions/api-error");

const OrderModel = require("../models/order-model");

// TODO: вынести в сервисы

class orderController {
	async addOrderItems(req, res, next) {
		try {
			const {
				orderItems,
				customerData,
				shippingAddress,
				paymentMethod,
				itemsPrice,
				taxPrice,
				shippingPrice,
				totalPrice,
			} = req.body;

			if (orderItems && orderItems.length === 0) {
				throw ApiError.BadRequests("Order is empty");
			}
			const order = await OrderModel.create({
				user: req.user.id,
				customerData,
				orderItems,
				shippingAddress,
				paymentMethod,
				itemsPrice,
				taxPrice,
				shippingPrice,
				totalPrice,
			});

			return res.json(order._id);
		} catch (error) {
			next(error);
		}
	}

	async getAllOrders(req, res, next) {
		try {
			const {
				limit,
				page,
				createdAtFrom,
				createdAtUpTo,
				orderId,
				custumerEmail,
			} = req.query;

			let query = {};

			if (createdAtFrom && createdAtUpTo) {
				const startDate = new Date(createdAtFrom).setHours(0, 0, 0, 0);
				const endDate = new Date(createdAtUpTo).setHours(23, 59, 59, 999);

				query.createdAt = { $gte: startDate, $lte: endDate };
			}

			if (orderId) {
				query._id = orderId;
			}

			if (custumerEmail) {
				query["customerData.email"] = new RegExp(custumerEmail, "i");
			}

			if (!limit || !page) {
				const orders = await OrderModel.find(query).sort({
					createdAt: -1,
				});
				const totalOrders = orders.length;
				return res.json({ orders, currentPage: 1, totalPages: 1, totalOrders });
			}
			// pagination
			const skip = (page - 1) * limit;
			const totalOrders = await OrderModel.countDocuments(query);
			const totalPages = Math.ceil(totalOrders / limit);
			const orders = await OrderModel.find(query).skip(skip).limit(limit).sort({
				createdAt: -1,
			});
			return res.json({ orders, currentPage: page, totalPages, totalOrders });
		} catch (error) {
			next(error);
		}
	}

	async getMyOrders(req, res, next) {
		try {
			const orders = await OrderModel.find({ user: req.user.id }).sort({
				createdAt: -1,
			});

			return res.json(orders);
		} catch (error) {
			next(error);
		}
	}

	async getOrderById(req, res, next) {
		try {
			const orderId = req.params.id;
			const order = await OrderModel.findById(orderId);

			const isAdmin = req.user.role === "ADMIN";

			console.log("IS ADMIN? " + isAdmin);

			if (req.user.id !== order.user.toString()) {
				throw ApiError.BadRequests("Order not found");
			}

			if (order) {
				return res.json(order);
			} else {
				throw ApiError.BadRequests("Order not found");
			}
		} catch (error) {
			next(error);
		}
	}

	async updateOrderToPaid(req, res, next) {
		try {
			const orderId = req.params.id;
			const order = await OrderModel.findById(orderId);

			if (order) {
				order.isPaid = true;
				order.paidAt = Date.now();
				order.paymentResult = {
					id: req.body.id,
					status: req.body.status,
					update_time: req.body.update_time,
					email_address: req.body.payer.email_address,
				};
				order.inDelivery = true;
			} else {
				throw ApiError.BadRequests("Order not found");
			}

			const updatedOrder = await order.save();

			return res.json(updatedOrder);
		} catch (error) {
			next(error);
		}
	}

	async updateOrderToDelivered(req, res, next) {
		try {
			const orderId = req.params.id;
			const order = await OrderModel.findById(orderId);

			if (!order.isPaid)
				throw ApiError.BadRequests("The order has not yet been paid");

			if (order) {
				order.isDelivered = true;
				order.deliveredAt = Date.now();
				order.inDelivery = false;
			} else {
				throw ApiError.BadRequests("Order not found");
			}

			const updatedOrder = await order.save();

			return res.json(updatedOrder);
		} catch (error) {
			next(error);
		}
	}

	async deleteOrder(req, res, next) {
		try {
			const ordertId = req.params.id;
			const order = await OrderModel.findByIdAndDelete(ordertId);

			if (!order) {
				throw ApiError.BadRequests("Product not found");
			}

			return res.json(order);
		} catch (error) {
			next(error);
		}
	}

	async getStatisticYear(req, res, next) {
		try {
			const year = parseInt(req.params.year);

			const currentDate = new Date();
			const currentYear = currentDate.getFullYear();
			const currentMonth = currentDate.getMonth() + 1;

			if (year > currentYear) {
				throw ApiError.BadRequests("The current year has not yet arrived");
			}

			const pipeline = [
				{
					$match: {
						createdAt: {
							$gte: new Date(`${year}-01-01`),
							$lt: new Date(`${year + 1}-01-01`),
						},
					},
				},
				{
					$group: {
						_id: { $month: "$createdAt" },
						count: { $sum: 1 },
					},
				},
			];

			const result = await OrderModel.aggregate(pipeline);

			const countsByMonth = {};
			result.forEach((entry) => {
				countsByMonth[entry._id] = entry.count;
			});

			const monthsInYear = Array.from(
				{ length: year === currentYear ? currentMonth : 12 },
				(_, i) => i + 1
			);

			const monthNames = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			];

			const mergedData = monthsInYear.map((month) => ({
				month,
				monthName: monthNames[month - 1],
				count: countsByMonth[month] || 0,
			}));

			return res.json(mergedData);
		} catch (error) {
			next(error);
		}
	}

	async getStatisticMonth(req, res, next) {
		try {
			const { month, year } = req.params;

			const currentYear = new Date().getFullYear();
			const currentMonth = new Date().getMonth() + 1;

			if (year > currentYear) {
				throw ApiError.BadRequests("The current year has not yet arrived");
			}

			if (month > currentMonth) {
				throw ApiError.BadRequests("The current month has not yet arrived");
			}

			const firstDayOfMonth = new Date(year, month - 1, 1);
			const lastDayOfMonth = new Date(year, month, 0);

			const pipeline = [
				{
					$match: {
						createdAt: {
							$gt: firstDayOfMonth,
							$lte: lastDayOfMonth,
						},
					},
				},
				{
					$group: {
						_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
						count: { $sum: 1 },
					},
				},
				{
					$sort: { _id: 1 },
				},
			];

			const result = await OrderModel.aggregate(pipeline);

			const daysWithCounts = [];
			const currentDate = new Date(year, month - 1, 2);

			while (currentDate <= lastDayOfMonth) {
				const formattedDate = currentDate.toISOString().split("T")[0];
				const foundEntry = result.find((entry) => entry._id === formattedDate);

				daysWithCounts.push({
					day: formattedDate,
					count: foundEntry ? foundEntry.count : 0,
				});

				currentDate.setDate(currentDate.getDate() + 1);
			}

			return res.json(daysWithCounts);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new orderController();
