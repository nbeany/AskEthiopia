const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ import it

// Public routes
router.get("/", questionController.getAllQuestions);
router.get("/:questionid", questionController.getQuestionById);

// Protected routes
router.post("/", authMiddleware, questionController.createQuestion);
router.put("/:questionid", authMiddleware, questionController.updateQuestion);
router.delete("/:questionid", authMiddleware, questionController.deleteQuestion);

module.exports = router;
