const mongoose = require("mongoose");
const Mechanic = require("../models/mechanic");
const dummyMechanics = require("./dummyMechanics");

mongoose.connect("mongodb://127.0.0.1:27017/wrenzo");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

db.once("open", async () => {
  console.log("Connected to MongoDB");

  try {
    await Mechanic.deleteMany({});
    console.log("Old data cleared");

    await Mechanic.insertMany(dummyMechanics);
    console.log("Dummy mechanics inserted");

  } catch (err) {
    console.error("Insert error:", err);
  } finally {
    mongoose.connection.close();
  }
});