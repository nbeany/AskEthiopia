const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Question = sequelize.define("Question", {
  questionid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// ✅ Relationships
Question.belongsTo(User, { foreignKey: "userid", onDelete: "CASCADE" });
User.hasMany(Question, { foreignKey: "userid", onDelete: "CASCADE" });

module.exports = Question;
