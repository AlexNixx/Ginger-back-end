const { Schema, model } = require("mongoose");

const CategotySchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	photoUrl: {
		type: String,
	},
});

module.exports = model("Category", CategotySchema);
