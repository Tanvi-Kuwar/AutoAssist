require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
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

// ================= ENV =================
const dbUrl = process.env.ATLASDB_URL;
const sessionSecret = process.env.SESSION_SECRET;

if (!dbUrl) throw new Error("ATLASDB_URL missing in env");
if (!sessionSecret) throw new Error("SESSION_SECRET missing in env");

// ================= CORS =================
const allowedOrigins = [
  "http://localhost:5173",
  "https://autoassist-ui.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("⚡ Connected:", socket.id);

  socket.on("join-user", (userId) => {
    socket.join(userId);
  });

  socket.on("join-mechanic", (mechanicId) => {
    socket.join(mechanicId);
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
});

// ================= DATABASE =================
mongoose.connect(dbUrl)
  .then(() => {
    console.log("✅ MongoDB Connected");

    // ================= SESSION STORE =================
    const store = MongoStore.create({
      mongoUrl: dbUrl,
      crypto: {
        secret: sessionSecret,
      },
      touchAfter: 24 * 3600,
    });

    store.on("error", (err) => {
      console.log("SESSION STORE ERROR:", err);
    });

    // ================= SESSION =================
    app.use(session({
      store,
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,

        // IMPORTANT for production (Render + HTTPS)
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

    // ================= ROUTES =================
    app.use("/api/admin", adminRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/emergency", emergencyRoutes);
    app.use("/api/bookings", bookingRoutes);
    app.use("/api/mechanics", mechanicRoutes);

    // ================= TEST ROUTE =================
    app.get("/", (req, res) => {
      res.send("🚀 API is running");
    });

    // ================= SERVER START =================
    server.listen(5000, () => {
      console.log("🚀 Server running on port 5000");
    });

  })
  .catch((err) => {
    console.log("❌ DB Error:", err);
  });