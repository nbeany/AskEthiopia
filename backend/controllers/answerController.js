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

exports.updateAnswer = async (req, res) => {
  try {
    const { answerid } = req.params;
    const { answer } = req.body;
    
    const existingAnswer = await Answer.findByPk(answerid);
    if (!existingAnswer) {
      return res.status(404).json({ error: "Answer not found" });
    }
    
    // Check if user owns the answer
    if (existingAnswer.userid !== req.user.userid) {
      return res.status(403).json({ error: "Not authorized to update this answer" });
    }
    
    await existingAnswer.update({ answer });
    res.json(existingAnswer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAnswer = async (req, res) => {
  try {
    const { answerid } = req.params;
    
    const existingAnswer = await Answer.findByPk(answerid);
    if (!existingAnswer) {
      return res.status(404).json({ error: "Answer not found" });
    }
    
    // Check if user owns the answer
    if (existingAnswer.userid !== req.user.userid) {
      return res.status(403).json({ error: "Not authorized to delete this answer" });
    }
    
    await existingAnswer.destroy();
    res.json({ message: "Answer deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};