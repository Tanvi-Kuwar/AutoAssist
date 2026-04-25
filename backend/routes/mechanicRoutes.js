const express = require("express");
const router = express.Router();
const Mechanic = require("../models/mechanic");
const getCity = require("../utils/reverseGeocode");

// ================= REGISTER MECHANIC =================
router.post("/register", async (req, res) => {
  try {
    const { lat, lng } = req.body;

    // Default safe fallback
    let place = {};

    try {
      place = await getCity(lat, lng);
    } catch (geoErr) {
      console.log("Geo error:", geoErr.message);
    }

    const currentLocation = [
      place?.city || place?.town || place?.village || place?.county || "",
      place?.state || "",
      place?.country || "",
    ]
      .filter(Boolean)
      .join(", ");

    const mechanic = await Mechanic.create({
      ...req.body,

      // 🔥 IMPORTANT FOR ADMIN FLOW
      isApproved: false,
      isOnline: false,

      // GPS location (for nearby search)
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },

      // Human readable location (for UI)
      currentLocation: currentLocation || "Unknown Location",

      updatedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Registration sent for admin approval",
      mechanic,
    });
  } catch (err) {
    console.log("REGISTER ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ================= LOGIN MECHANIC =================
// (simple phone + password login or phone-only demo)
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    const mechanic = await Mechanic.findOne({ phone });

    if (!mechanic) {
      return res.status(404).json({
        success: false,
        message: "Mechanic not found",
      });
    }

    // optional password check (if you use it)
    if (password && mechanic.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    res.json({
      success: true,
      mechanic,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ================= GET SINGLE MECHANIC =================
router.get("/:id", async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params.id);

    if (!mechanic) {
      return res.status(404).json({
        success: false,
        message: "Mechanic not found",
      });
    }

    res.json({
      success: true,
      mechanic,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ================= UPDATE LOCATION =================
router.put("/location/:id", async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const place = await getCity(lat, lng);

    const mechanic = await Mechanic.findByIdAndUpdate(
      req.params.id,
      {
        location: {
          type: "Point",
          coordinates: [lng, lat],
        },

        currentLocation: place, // 👈 ALWAYS UPDATED
        isOnline: true,
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.json({
      success: true,
      mechanic,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ================= GET NEARBY MECHANICS =================
router.post("/nearby", async (req, res) => {
  try {
    const { lat, lng, maxDistance = 5000 } = req.body;

    const mechanics = await Mechanic.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: maxDistance, // meters
        },
      },
      isApproved: true,
    });

    res.json({
      success: true,
      mechanics,
    });
  } catch (err) {
    console.error("NEARBY ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Error finding nearby mechanics",
    });
  }
});



router.get("/status/:id", async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params.id);

    if (!mechanic) {
      return res.json({
        success: false,
        status: "deleted",
        message: "Account removed by admin",
      });
    }

    res.json({
      success: true,
      status: mechanic.isApproved
        ? "approved"
        : "pending",
      mechanic,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;