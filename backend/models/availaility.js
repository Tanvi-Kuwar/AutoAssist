const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  mechanic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  date: Date,

  slots: [
    {
      startTime: String, // "09:00"
      endTime: String,   // "10:00"
      isBooked: {
        type: Boolean,
        default: false
      }
    }
  ]
});

module.exports = mongoose.model("Availability", availabilitySchema);