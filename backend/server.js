const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./models");

const authRoutes = require("./routes/auth");
const questionRoutes = require("./routes/questions");
const answerRoutes = require("./routes/answers");

const app = express();
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/auth", authRoutes);
app.use("/questions", questionRoutes);
app.use("/answers", answerRoutes);

// Serve React frontend
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// Port
const PORT = process.env.PORT || 5000;

// Database sync with fallback
const syncDatabase = async () => {
  try {
    // Try normal sync
    await sequelize.sync({ force: false });
    console.log("✅ Database synced successfully");
  } catch (err) {
    console.error("❌ Database sync failed:", err.message);

    if (
      err.message.includes("Too many keys") ||
      err.message.includes("Incorrect integer value")
    ) {
      console.log("🔄 Attempting to reset database due to schema mismatch...");
      try {
        // Force recreate tables to match models
        await sequelize.sync({ force: true });
        console.log("✅ Database reset and synced successfully");
      } catch (resetErr) {
        console.error("❌ Database reset failed:", resetErr.message);
        console.log("⚠️  Starting server without database sync...");
      }
    } else {
      console.log("⚠️  Starting server without database sync...");
    }
  }
};

// Start server
syncDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Database: ${sequelize.getDatabaseName()}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to start server:", err);
  });
