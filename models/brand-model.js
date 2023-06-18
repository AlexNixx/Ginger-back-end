const { Schema, model } = require("mongoose");

const BrandSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	photoUrl: {
		type: String,
	},
});

module.exports = model("Brand", BrandSchema);
