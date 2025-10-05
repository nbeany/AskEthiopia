const sequelize = require("../config/db");
const User = require("./User");
const Question = require("./Question");
const Answer = require("./Answer");

module.exports = { sequelize, User, Question, Answer };
