const mongoose = require("mongoose");
const connection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/commerce", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to MongoDB:", error);
    process.exit(1);
  }
};
  
module.exports = connection;