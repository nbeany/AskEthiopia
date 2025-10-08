const express = require("express");
const { createAnswer, getAnswersByQuestion } = require("../controllers/answerController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", auth, createAnswer);
router.get("/:questionid", getAnswersByQuestion);

module.exports = router;
