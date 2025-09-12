function register(req, res) {
    res.send('Register user');
}

function login(req, res) {
    res.send('Login user');
}

function check(req, res) {
    res.send('Check user');
}

module.exports = {
    register,
    login,
    check
};
