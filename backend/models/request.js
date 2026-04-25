const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  issue: String,
  location: {
    lat: Number,
    lng: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Request", requestSchema);