require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const LocalStrategy = require("passport-local");

const http = require("http");
const { Server } = require("socket.io");

const User = require("./models/user");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const mechanicRoutes = require("./routes/mechanicRoutes");
const adminRoutes = require("./routes/admin");


const app = express();
const server = http.createServer(app);

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://autoassist-ui.onrender.com"
    ],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});
// make io accessible in routes
app.set("io", io);

// ================= SOCKET LOGIC =================
io.on("connection", (socket) => {
  console.log("⚡ Connected:", socket.id);

  socket.on("join-user", (userId) => {
    socket.join(userId);

    // optional safety log
    console.log(`User joined room: ${userId}`);
  });

  socket.on("join-mechanic", (mechanicId) => {
    socket.join(mechanicId);
    console.log(`Mechanic joined room: ${mechanicId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
});
// ================= MIDDLEWARE =================
app.use(cors({
  origin: "https://autoassist-ui.onrender.com",
  credentials: true
}));

app.use(express.json());
app.use("/api/admin", adminRoutes);
// ================= SESSION =================

const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

app.use(session({
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true
  }
}));


// ================= PASSPORT =================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================= DATABASE =================
// const dbUrl = process.env.ATLASDB_URL;

mongoose.connect(dbUrl)
  .then(() => {
    console.log("✅ MongoDB Connected (Atlas)");
    console.log("🌍 Host:", mongoose.connection.host);
    console.log("📦 DB:", mongoose.connection.name);

    // 👉 START SERVER ONLY AFTER DB CONNECTS
    server.listen(5000, () => {
      console.log("🚀 Server running on http://localhost:5000");
    });

  })
  .catch(err => {
    console.log("❌ DB Error:", err);
  });

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/mechanics", mechanicRoutes);


app.get("/create-user", async (req, res) => {
  const user = new User({
    username: "testuser",
    email: "test@test.com"
  });

  await User.register(user, "123456");

  res.send("User created in Atlas!");
});

// ================= TEST =================
app.get("/", (req, res) => {
  res.send("🚀 API is running");
});

// ================= START =================
// server.listen(5000, () => {
//   console.log("🚀 Server running on http://localhost:5000");
// });