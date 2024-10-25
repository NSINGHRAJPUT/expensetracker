const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MOONGOOSE_URI;
    await mongoose.connect(uri);
  } catch (error) {
    console.log("mongoose connection failed");
    process.exit(1);
  }
};

module.exports = connectDB;
