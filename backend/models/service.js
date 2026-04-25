const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: String,
  duration: Number,
  price: Number,

  supportedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User" // mechanics
    }
  ]
});

module.exports = mongoose.model("Service", serviceSchema);