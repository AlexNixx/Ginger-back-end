const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
	name: { type: String, required: true },
	surname: { type: String, required: true },
	email: { type: String, unique: true, required: true },
	password: { type: String, default: false },
	role: { type: String, required: true, default: "USER" },
	isActivated: { type: Boolean, default: false },
	activationLink: { type: String },
	address: {
		city: { type: String },
		address: { type: String },
		postalCode: { type: String },
		country: { type: String },
	},
});

module.exports = model("User", UserSchema);
