const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    const newUser = new User({ username, email, phone });

    const registeredUser = await User.register(newUser, password);

    res.json({
      success: true,
      message: "User registered",
      user: {
        _id: registeredUser._id,
        username: registeredUser.username,
        phone: registeredUser.phone,
      },
    });

  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});




// ================= LOGIN =================
router.post("/login", (req, res, next) => {
  console.log("LOGIN BODY:", req.body);

  passport.authenticate("local", (err, user, info) => {

    if (err) {
      console.log("LOGIN ERROR:", err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (!user) {
      console.log("FAILED LOGIN INFO:", info);
      return res.status(400).json({
        success: false,
        message: info?.message || "Invalid credentials",
      });
    }

    req.login(user, (err) => {
      if (err) {
        console.log("SESSION ERROR:", err);
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      return res.json({
        success: true,
        user,
      });
    });

  })(req, res, next);
});


// ================= LOGOUT =================
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.json({ success: true, message: "Logged out" });
  });
});




router.get("/me", (req, res) => {
  if (!req.user) {
    return res.json({ user: null });
  }

  return res.json({
    success: true,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone
    }
  });
});


module.exports = router;