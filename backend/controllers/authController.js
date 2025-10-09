const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { username, firstname, lastname, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      firstname,
      lastname,
      email,
      password: hashed,
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userid: user.userid, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send both token and user to match frontend expectations
    res.json({ token, user: {
      userid: user.userid,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname
    }});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

