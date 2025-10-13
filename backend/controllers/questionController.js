const Question = require("../models/Question");
const { Op } = require("sequelize");

// Create
exports.createQuestion = async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const userid = req.user.userid; // assuming you set req.user from JWT
    const question = await Question.create({ title, description, tag, userid });
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All
exports.getAllQuestions = async (req, res) => {
  try {
    const { tag, q } = req.query;
    const where = {};

    if (tag) where.tag = tag;
    if (q) where.title = { [Op.like]: `%${q}%` };

    const questions = await Question.findAll({ where });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get by questionid
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findOne({
      where: { questionid: req.params.questionid },
    });
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update
exports.updateQuestion = async (req, res) => {
  try {
    const { questionid } = req.params;
    const [updated] = await Question.update(req.body, {
      where: { questionid },
    });
    if (!updated) return res.status(404).json({ message: "Question not found" });
    res.json({ message: "Question updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete
exports.deleteQuestion = async (req, res) => {
  try {
    const { questionid } = req.params;
    const deleted = await Question.destroy({ where: { questionid } });
    if (!deleted) return res.status(404).json({ message: "Question not found" });
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
