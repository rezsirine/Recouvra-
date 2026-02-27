const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/recouvraplus");
    console.log("✅ MongoDB connection established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to MongoDB:", error);
    process.exit(1);
  }
};

connection();

module.exports = connection;