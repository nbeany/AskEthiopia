const { Answer } = require("../models");

exports.createAnswer = async (req, res) => {
  try {
    const { questionid, answer } = req.body;
    const newAnswer = await Answer.create({
      userid: req.user.userid,
      questionid,
      answer,
    });
    res.json(newAnswer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAnswersByQuestion = async (req, res) => {
  const { questionid } = req.params;
  const answers = await Answer.findAll({ where: { questionid } });
  res.json(answers);
};
