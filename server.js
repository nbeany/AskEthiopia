const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

const authRoutes = require("./routes/auth");
const questionRoutes = require("./routes/questions");
const answerRoutes = require("./routes/answers");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/questions", questionRoutes);
app.use("/answers", answerRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
});
