module.exports = class UserDto {
	name;
	surname;
	email;
	id;
	isActivated;
	role;
	address;

	constructor(model) {
		this.name = model.name;
		this.surname = model.surname;
		this.email = model.email;
		this.id = model._id;
		this.isActivated = model.isActivated;
		this.role = model.role;
		this.address = model.address;
	}
};
