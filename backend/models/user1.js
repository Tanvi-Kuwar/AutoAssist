const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },

  role: {
    type: String,
    enum: ["customer", "admin", "mechanic"],
    default: "customer"
  },

  mechanicProfile: {
    experience: Number,
    specialization: [String], // ["engine", "brakes"]
    isAvailable: {
      type: Boolean,
      default: true
    }
  }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);