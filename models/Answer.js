const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Question = require("./Question");

const Answer = sequelize.define("Answer", {
  answerid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userid: { type: DataTypes.INTEGER, allowNull: false },
  questionid: { type: DataTypes.STRING, allowNull: false },
  answer: { type: DataTypes.TEXT, allowNull: false },
});

Answer.belongsTo(User, { foreignKey: "userid" });
User.hasMany(Answer, { foreignKey: "userid" });

Answer.belongsTo(Question, { foreignKey: "questionid", targetKey: "questionid" });
Question.hasMany(Answer, { foreignKey: "questionid", sourceKey: "questionid" });

module.exports = Answer;
