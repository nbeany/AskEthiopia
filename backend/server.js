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

// Database sync with fallback
const syncDatabase = async () => {
  try {
    // First try normal sync
    await sequelize.sync({ force: false });
    console.log('✅ Database synced successfully');
  } catch (err) {
    console.error('❌ Database sync failed:', err.message);
    
    if (err.message.includes('Too many keys') || err.message.includes('Incorrect integer value')) {
      console.log('🔄 Attempting to reset database due to schema mismatch...');
      try {
        // Force recreate tables to match current model definitions
        await sequelize.sync({ force: true });
        console.log('✅ Database reset and synced successfully');
      } catch (resetErr) {
        console.error('❌ Database reset failed:', resetErr.message);
        console.log('⚠️  Starting server without database sync...');
      }
    } else {
      console.log('⚠️  Starting server without database sync...');
    }
  }
};

// Start server
syncDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Database: ${sequelize.getDatabaseName()}`);
  });
}).catch(err => {
  console.error('❌ Failed to start server:', err);
});
