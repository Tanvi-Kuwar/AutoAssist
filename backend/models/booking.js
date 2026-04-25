const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: String,
      phone: String,
    },

    mechanicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mechanic",
      required: true,
    },

    issue: String,

    location: {
      lat: Number,
      lng: Number,
    },

    vehicle: {
      type: {
        type: String,
      },
      model: String,
      number: String,
    },

    notes: String,

    status: {
      type: String,
      enum: ["pending", "accepted", "on the way", "completed", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);