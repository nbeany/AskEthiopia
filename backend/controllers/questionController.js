const Question = require("../models/Question");
const { Op } = require("sequelize");

// Create
exports.createQuestion = async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const userid = parseInt(req.user.userid); // Ensure integer type
    const question = await Question.create({ title, description, tag, userid });
    
    // Fetch the question with user information
    const questionWithUser = await Question.findByPk(question.questionid, {
      include: [
        {
          model: require("../models/User"),
          attributes: ['userid', 'username', 'firstname', 'lastname']
        }
      ]
    });
    
    res.status(201).json(questionWithUser);
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

    const questions = await Question.findAll({ 
      where,
      include: [
        {
          model: require("../models/User"),
          attributes: ['userid', 'username', 'firstname', 'lastname']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
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
      include: [
        {
          model: require("../models/User"),
          attributes: ['userid', 'username', 'firstname', 'lastname']
        }
      ]
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
    
    // First check if question exists and user owns it
    const existingQuestion = await Question.findByPk(questionid);
    if (!existingQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    
    // Check if user owns the question
    if (existingQuestion.userid !== parseInt(req.user.userid)) {
      return res.status(403).json({ error: "Not authorized to update this question" });
    }
    
    // Update the question
    await existingQuestion.update(req.body);
    
    // Fetch the updated question with user information
    const updatedQuestion = await Question.findByPk(questionid, {
      include: [
        {
          model: require("../models/User"),
          attributes: ['userid', 'username', 'firstname', 'lastname']
        }
      ]
    });
    
    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete
exports.deleteQuestion = async (req, res) => {
  try {
    const { questionid } = req.params;
    
    // First check if question exists and user owns it
    const existingQuestion = await Question.findByPk(questionid);
    if (!existingQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    
    // Check if user owns the question
    if (existingQuestion.userid !== parseInt(req.user.userid)) {
      return res.status(403).json({ error: "Not authorized to delete this question" });
    }
    
    // First delete all associated answers
    const Answer = require("../models/Answer");
    await Answer.destroy({
      where: { questionid: questionid }
    });
    
    // Then delete the question
    await existingQuestion.destroy();
    
    res.json({ message: "Question and all associated answers deleted successfully" });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: error.message });
  }
};
