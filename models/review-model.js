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

module.exports = model("Review", ReviewSchema);
