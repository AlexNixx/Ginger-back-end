const { Schema, model } = require("mongoose");

const OrderSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		customerData: {
			name: { type: String, required: true },
			surname: { type: String, required: true },
			email: { type: String, required: true },
		},
		orderItems: [
			{
				qty: { type: Number, required: true, default: 0 },
				title: { type: String, required: true },
				price: { type: Number, required: true, default: 0 },
				image: { type: String, required: true },
				product: {
					type: Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
			},
		],
		shippingAddress: {
			address: { type: String, required: true },
			city: { type: String, required: true },
			postalCode: { type: String, required: true },
			country: { type: String, required: true },
		},
		paymentMethod: {
			type: String,
			required: true,
		},
		// depends on if stripe or paypal method is used
		paymentResult: {
			id: { type: String },
			status: { type: String },
			update_time: { type: String },
			email_address: { type: String },
		},
		itemsPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		taxPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		shippingPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		totalPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		isPaid: {
			type: Boolean,
			default: false,
		},
		isDelivered: {
			type: Boolean,
			default: false,
		},
		inDelivery: {
			type: Boolean,
			default: false,
		},
		paidAt: {
			type: Date,
		},
		deliveredAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = model("Order", OrderSchema);
