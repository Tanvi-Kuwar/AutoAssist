const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  brand: String,
  model: String,
  year: Number,
  fuelType: String,
  registrationNumber: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", vehicleSchema);

