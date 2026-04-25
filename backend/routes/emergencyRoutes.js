const express = require("express");
const router = express.Router();
const Mechanic = require("../models/mechanic");

//
// 🚨 POST EMERGENCY (GEO QUERY VERSION)
//
router.post("/", async (req, res) => {
  try {
    const { issue, location } = req.body;

    if (!location) {
      return res.status(400).json({ message: "Location required" });
    }

    const { lng, lat } = location;

    // 🔥 GEO QUERY (REAL NEAREST SEARCH)
    const mechanics = await Mechanic.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: 5000, // 5km
        },
      },
    });

    res.json({
      success: true,
      issue,
      location,
      count: mechanics.length,
      mechanics,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//
// 🔧 GET ALL MECHANICS
//
router.get("/mechanics", async (req, res) => {
  try {
    const mechanics = await Mechanic.find();

    res.json({
      success: true,
      count: mechanics.length,
      mechanics,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});



// ✅ IMPORTANT FIX
module.exports = router;