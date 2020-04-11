const isLoggedIn = () => {
	// returns token if logged in, else null
	return localStorage.getItem("token");
};

const setToken = (token) => {
	localStorage.setItem("token", token);
}

exports.isLoggedIn = isLoggedIn;
exports.setToken = setToken;