const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  date: Date,
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed"],
    default: "pending"
  }
});

module.exports = mongoose.model("Appointment", appointmentSchema);