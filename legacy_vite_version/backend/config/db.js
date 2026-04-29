const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`👉 Please ensure MongoDB is installed and running locally on port 27017.`);
    console.error(`👉 Or update MONGO_URI in backend/.env with a MongoDB Atlas connection string.`);
    // We don't exit here so the server can still respond (with errors) instead of crashing.
  }
};

module.exports = connectDB;
