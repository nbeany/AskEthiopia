const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Question = sequelize.define("Question", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userid: { type: DataTypes.INTEGER, allowNull: false },
  questionid: { type: DataTypes.STRING, allowNull: false, unique: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  tag: { type: DataTypes.STRING },
});

Question.belongsTo(User, { foreignKey: "userid" });
User.hasMany(Question, { foreignKey: "userid" });

module.exports = Question;
