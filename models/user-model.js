const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
	email: { type: String, unique: true, required: true },
	password: { type: String, default: false },
	role: { type: String, required: true, default: "USER" },
	isActivated: { type: Boolean, default: false },
	activationLink: { type: String },
});

module.exports = model("User", UserSchema);
