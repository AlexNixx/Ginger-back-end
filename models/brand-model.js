const { Schema, model } = require("mongoose");

const BrandSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
});

module.exports = model("Brand", BrandSchema);
