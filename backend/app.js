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

if (!dbUrl) throw new Error("ATLASDB_URL missing");
if (!sessionSecret) throw new Error("SESSION_SECRET missing");

// ================= MIDDLEWARE =================
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// ================= SOCKET =================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("⚡ Connected:", socket.id);

  socket.on("join-user", (id) => socket.join(id));
  socket.on("join-mechanic", (id) => socket.join(id));

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
      console.log("SESSION ERROR:", err);
    });

    // ================= SESSION =================
    app.use(session({
      store,
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: true, // set true in production (Render)
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

    // ================= START =================
    server.listen(5000, () => {
      console.log("🚀 Server running on port 5000");
    });

  })
  .catch((err) => {
    console.log("❌ DB Error:", err);
  });

// ================= TEST =================
app.get("/", (req, res) => {
  res.send("🚀 API is running");
});