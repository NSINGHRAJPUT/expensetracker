const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "expenseUser",
    required: true,
  },
});

const Location =
  mongoose.models.Location || mongoose.model("Location", locationSchema);

module.exports = Location;
