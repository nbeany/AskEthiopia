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
    "https://ask-ethiopia-frontend.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

// API Routes
app.use("/auth", authRoutes);
app.use("/questions", questionRoutes);
app.use("/answers", answerRoutes);

// Serve React static files
const reactBuildPath = path.join(__dirname, "../frontend/build");
app.use(express.static(reactBuildPath));

// SPA fallback middleware (no path-to-regexp patterns used)
// This middleware will serve index.html for GET requests that:
//  - don't start with known API prefixes (auth/questions/answers)
//  - don't point to a file with an extension (like .js, .css, .png)
//  - accept HTML (so API JSON requests / XHR don't get HTML)
app.use((req, res, next) => {
  if (req.method !== "GET") return next();

  const urlPath = req.path || req.originalUrl || "";
  const isApi = urlPath.startsWith("/auth") || urlPath.startsWith("/questions") || urlPath.startsWith("/answers");
  const hasExt = path.extname(urlPath) !== "";
  const acceptHeader = (req.headers.accept || "");

  if (isApi || hasExt) return next();

  // Only serve the SPA for clients that accept HTML
  if (acceptHeader.includes("text/html")) {
    return res.sendFile(path.join(reactBuildPath, "index.html"), (err) => {
      if (err) next(err);
    });
  }

  return next();
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
    } else {
      console.log("⚠️ Starting server without DB sync due to error.");
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
        console.log("⚠️ No database name available (DB may be down).");
      }
    });
  })
  .catch((err) => {
    console.error("🔥 Failed to start server:", err);
  });
