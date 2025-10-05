const { Question } = require("../models");

exports.createQuestion = async (req, res) => {
  try {
    const { questionid, title, description, tag } = req.body;
    const newQuestion = await Question.create({
      userid: req.user.userid,
      questionid,
      title,
      description,
      tag,
    });
    res.json(newQuestion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllQuestions = async (req, res) => {
  const questions = await Question.findAll();
  res.json(questions);
};

exports.getQuestionById = async (req, res) => {
  const question = await Question.findOne({ where: { questionid: req.params.questionid } });
  if (!question) return res.status(404).json({ message: "Not found" });
  res.json(question);
};
