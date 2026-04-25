require("dotenv").config();
const mongoose = require("mongoose");

const dbUrl = process.env.ATLASDB_URL;

async function connectDB() {
  try {
    await mongoose.connect(dbUrl);
    console.log("✅ MongoDB Connected (Atlas)");
  } catch (err) {
    console.error("❌ DB Error:", err);
  }
}

module.exports = connectDB;