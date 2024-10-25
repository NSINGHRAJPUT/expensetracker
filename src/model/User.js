const mongoose = require("mongoose");

let expenseUser;

try {
  expenseUser = mongoose.model("expenseUser");
} catch (error) {
  const expenseUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isPremium: { type: Boolean, default: false },
    isPasswordReset: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  });

  expenseUser = mongoose.model("expenseUser", expenseUserSchema);
}

module.exports = expenseUser;
