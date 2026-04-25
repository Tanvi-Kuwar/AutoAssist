const express = require("express");
const router = express.Router();
const Mechanic = require("../models/mechanic");


// ================= GET PENDING MECHANICS =================
router.get("/mechanics/pending", async (req, res) => {
  try {
    const mechanics = await Mechanic.find({ isApproved: false })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      mechanics,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// ================= GET ALL MECHANICS (OPTIONAL ADMIN VIEW) =================
router.get("/mechanics", async (req, res) => {
  try {
    const mechanics = await Mechanic.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      mechanics,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// ================= APPROVE MECHANIC =================
router.put("/mechanics/approve/:id", async (req, res) => {
  try {
    const mechanic = await Mechanic.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    res.json({
      success: true,
      message: "Mechanic approved",
      mechanic,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// ================= REJECT MECHANIC (BETTER THAN DELETE) =================
router.put("/mechanics/reject/:id", async (req, res) => {
  try {
    const mechanic = await Mechanic.findByIdAndUpdate(
      req.params.id,
      { isApproved: false },
      { new: true }
    );

    res.json({
      success: true,
      message: "Mechanic rejected",
      mechanic,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// ================= DELETE MECHANIC (OPTIONAL HARD DELETE) =================
router.put("/mechanics/reject/:id", async (req, res) => {
  try {
    const mechanic = await Mechanic.findByIdAndUpdate(
      req.params.id,
      { isApproved: false },
      { new: true }
    );

    res.json({ success: true, mechanic });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;