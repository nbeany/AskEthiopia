const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./models");

const authRoutes = require("./routes/auth");
const questionRoutes = require("./routes/questions");
const answerRoutes = require("./routes/answers");

require("dotenv").config();
const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://ask-ethiopia-frontend.vercel.app"  // your Vercel frontend
  ],
  credentials: true
}));
app.use(express.json());

// API Routes
app.use("/auth", authRoutes);
app.use("/questions", questionRoutes);
app.use("/answers", answerRoutes);

// Serve React frontend (STATIC FILES)
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Catch-all route for React SPA (IMPORTANT: use /* instead of *)
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// Port
const PORT = process.env.PORT || 5000;

// Database sync with fallback
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("✔️ Database synced successfully");
  } catch (err) {
    console.error("❌ Database sync failed:", err.message);

    if (
      err.message.includes("Too many keys") ||
      err.message.includes("Incorrect integer value")
    ) {
      console.log("⚠️ Attempting to reset database due to schema mismatch...");
      try {
        await sequelize.sync({ force: true });
        console.log("🔄 Database reset and synced successfully");
      } catch (resetErr) {
        console.error("💀 Database reset failed:", resetErr.message);
      }
    }
  }
};

// Start server
syncDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);

      try {
        console.log(`🛢️ Database: ${sequelize.getDatabaseName()}`);
      } catch {
        console.log("⚠️ No database name available (connection failure?)");
      }
    });
  })
  .catch((err) => {
    console.error("🔥 Failed to start server:", err);
  });
