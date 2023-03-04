const { Schema, model } = require("mongoose");

const CategotySchema = new Schema({
	name: {
		type: String,
		required: true,
	},
});

module.exports = model("Category", CategotySchema);
