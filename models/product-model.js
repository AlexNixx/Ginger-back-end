const { Schema, model } = require("mongoose");

const ReviewSchema = new Schema(
	{
		name: { type: String, require: true },
		rating: { type: Number, require: true },
		comment: { type: String, require: true },
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const ProductSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: "Category",
		required: true,
	},
	brand: {
		type: Schema.Types.ObjectId,
		ref: "Brand",
		required: true,
	},
	color: {
		type: Schema.Types.ObjectId,
		ref: "Color",
		required: true,
	},
	inStock: {
		type: Boolean,
		require: true,
		default: true,
	},
	deviceInfo: [
		{
			title: {
				type: String,
				required: true,
			},
			description: {
				type: String,
				required: true,
			},
		},
	],
	photoUrl: {
		type: String,
	},
	reviews: [ReviewSchema],

	rating: {
		type: Number,
		require: true,
		default: 0,
	},
	nubReviews: {
		type: Number,
		require: true,
		default: 0,
	},
});

ProductSchema.index({ title: "text" });

module.exports = model("Product", ProductSchema);
