const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

module.exports = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};