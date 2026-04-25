const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");

// ================= CREATE BOOKING =================
router.post("/", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    const io = req.app.get("io");

    // 🔥 send to mechanic ONLY
    io.to(booking.mechanicId.toString()).emit("new-booking", booking);

    res.status(201).json({ success: true, booking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});


router.get("/user/:userId", async (req, res) => {
  try {
    const booking = await Booking.findOne({
      "user._id": req.params.userId,
    }).sort({ createdAt: -1 });

    res.json({ booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= GET MECHANIC BOOKINGS =================
router.get("/:mechanicId", async (req, res) => {
  const bookings = await Booking.find({
    mechanicId: req.params.mechanicId,
  }).sort({ createdAt: -1 });

  res.json({ success: true, bookings });
});

// ================= UPDATE STATUS =================
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id).populate("user");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    const io = req.app.get("io");

    io.to(booking.user._id.toString()).emit("booking-status-update", {
      bookingId: booking._id.toString(),
      status: booking.status,
      updatedAt: Date.now(),
    });

    return res.json({ success: true, booking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});



module.exports = router;