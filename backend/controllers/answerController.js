const { Answer } = require("../models");

exports.createAnswer = async (req, res) => {
  try {
    const { questionid, answer } = req.body;
    
    // Validate required fields
    if (!questionid || !answer) {
      return res.status(400).json({ error: 'questionid and answer are required' });
    }
    
    if (!req.user || !req.user.userid) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const newAnswer = await Answer.create({
      userid: parseInt(req.user.userid), // Ensure integer type
      questionid,
      answer,
    });
    
    // Fetch the user information separately
    const user = await require("../models/User").findByPk(newAnswer.userid, {
      attributes: ['userid', 'username', 'firstname', 'lastname']
    });
    
    const answerWithUser = {
      ...newAnswer.toJSON(),
      User: user
    };
    
    res.status(201).json(answerWithUser);
  } catch (err) {
    console.error('Error creating answer:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.getAnswersByQuestion = async (req, res) => {
  try {
    const { questionid } = req.params;
    
    if (!questionid) {
      return res.status(400).json({ error: 'questionid is required' });
    }
    
    // Get answers and users separately to avoid relationship issues
    const answers = await Answer.findAll({ 
      where: { questionid },
      order: [['createdAt', 'DESC']]
    });
    
    // Get user information for each answer
    const answersWithUsers = await Promise.all(
      answers.map(async (answer) => {
        const user = await require("../models/User").findByPk(answer.userid, {
          attributes: ['userid', 'username', 'firstname', 'lastname']
        });
        return {
          ...answer.toJSON(),
          User: user
        };
      })
    );
    
    res.json(answersWithUsers);
  } catch (error) {
    console.error('Error getting answers:', error);
    res.status(500).json({ error: error.message });
  }
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
    if (existingAnswer.userid !== parseInt(req.user.userid)) {
      return res.status(403).json({ error: "Not authorized to update this answer" });
    }
    
    await existingAnswer.update({ answer });
    
    // Fetch the user information separately
    const user = await require("../models/User").findByPk(existingAnswer.userid, {
      attributes: ['userid', 'username', 'firstname', 'lastname']
    });
    
    const updatedAnswer = {
      ...existingAnswer.toJSON(),
      User: user
    };
    
    res.json(updatedAnswer);
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
    if (existingAnswer.userid !== parseInt(req.user.userid)) {
      return res.status(403).json({ error: "Not authorized to delete this answer" });
    }
    
    await existingAnswer.destroy();
    res.json({ message: "Answer deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};