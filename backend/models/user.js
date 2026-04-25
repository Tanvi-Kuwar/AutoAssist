const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  phone: String,
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer"
  }
}, { timestamps: true });

// IMPORTANT: use username (default behavior)
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
