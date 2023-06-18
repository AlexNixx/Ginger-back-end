// const orderService = require("../service/orderService");
const ApiError = require("../exceptions/api-error");

const OrderModel = require("../models/order-model");

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
			const orders = await OrderModel.find();

			return res.json(orders);
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

	async updateOrderToDeliver(req, res, next) {
		try {
			// const colors = await colorService.getAll();
			// return res.json(colors);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new orderController();
