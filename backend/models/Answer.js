const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Question = require("./Question");

const Answer = sequelize.define("Answer", {
  answerid: {
    type: DataTypes.UUID,
    defaultValue: () => require("uuid").v4(),
    primaryKey: true,
  },
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  questionid: {
    type: DataTypes.UUID, // ✅ Must match Question’s UUID type
    allowNull: false,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// ✅ Relationships
Answer.belongsTo(User, {
  foreignKey: "userid",
  onDelete: "CASCADE", // delete answers if user is deleted
});
User.hasMany(Answer, {
  foreignKey: "userid",
  onDelete: "CASCADE",
});

Answer.belongsTo(Question, {
  foreignKey: "questionid",
  targetKey: "questionid",
  onDelete: "CASCADE", // 
});
Question.hasMany(Answer, {
  foreignKey: "questionid",
  sourceKey: "questionid",
  onDelete: "CASCADE",
});

module.exports = Answer;


