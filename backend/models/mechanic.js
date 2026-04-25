const mongoose = require("mongoose");

const mechanicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    phone: String,
    password: String,

    skills: [String],
    experience: {
      type: Number,
      default: 0,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    // 🔥 GEOLOCATION (IMPORTANT FOR NEARBY SEARCH)
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
    currentLocation: String,
    updatedAt: Date,
    rating: {
      type: Number,
      default: 0,
    },

    totalJobs: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// 🔥 REQUIRED FOR NEARBY SEARCH (VERY IMPORTANT)
mechanicSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Mechanic", mechanicSchema);