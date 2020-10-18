let validate = {};

validate.usernameV = function (username) {
	const validUserPattern = /(?=^.{2,50}$)(?=.*[a-z]).*$/;
	return username.match(validUserPattern);
};

validate.emailV = (email) => {
	const validEmailPattern = /[\w-]+@([\w-]+\.)+[\w-]+/;
	return email.match(validEmailPattern);
};

validate.passwordV = (password) => {
	const validPassPattern = /(?=^.{6,100}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/;
	return password.match(validPassPattern);
};

validate.firstNameV = (firstname) => {
	const validNamePattern = /(?=^.{2,50}$)^[A-Za-z]+$/;
	return firstname.match(validNamePattern);
};

validate.lastNameV = (lastname) => {
	const validNamePattern = /(?=^.{2,50}$)^[A-Za-z]+$/;
	return lastname.match(validNamePattern);
};

module.exports = validate;