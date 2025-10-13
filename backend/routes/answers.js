const express = require("express");
const { createAnswer, getAnswersByQuestion, updateAnswer, deleteAnswer } = require("../controllers/answerController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", auth, createAnswer);
router.get("/:questionid", getAnswersByQuestion);
router.put("/:answerid", auth, updateAnswer);
router.delete("/:answerid", auth, deleteAnswer);

module.exports = router;
