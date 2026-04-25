import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import EmergencyPage from "./EmergencyPage";
import MechanicRegister from "./MechanicRegister";
import MechanicLogin from "./MechanicLogin";
import MechanicDashboard from "./MechanicDashboard";
import UserRegister from "./UserRegister";
import UserLogin from "./UserLogin";
import UserTracking from "./UserTracking"; // ✅ FIX 1
import Home from "./Home";
import AdminPanel from "./AdminPanel";


export default function App() {
  const [user, setUser] = useState(null);
  const [mechanic, setMechanic] = useState(null);
  const [location, setLocation] = useState(null);
  const [issue, setIssue] = useState("");
  const [result, setResult] = useState(null);
  const [booking, setBooking] = useState(null);

  // 📍 LOCATION
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.log(err);
        alert("Location permission denied");
      }
    );
  };

  // 🚨 EMERGENCY SEARCH
  const handleEmergency = async () => {
    if (!location || !issue) {
      alert("Select issue + location first");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issue, location }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔓 LOGOUT
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout");
      setUser(null);
      setBooking(null); // ✅ clear booking too
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Routes>

      {/* HOME */}
      <Route
        path="/"
        element={
          <Home
            user={user}
            setUser={setUser}
            getLocation={getLocation}
            handleLogout={handleLogout}
          />
        }
      />

      {/* EMERGENCY */}
      <Route
        path="/emergency"
        element={
          <EmergencyPage
            issue={issue}
            setIssue={setIssue}
            location={location}
            setLocation={setLocation}
            handleEmergency={handleEmergency}
            result={result}
            user={user}
            setBooking={setBooking}   // ✅ CRITICAL
          />
        }
      />

      {/* TRACKING */}
      <Route
  path="/tracking"
  element={
    user && booking ? (
      <UserTracking user={user} booking={booking} />
    ) : (
      <div className="p-4">No active booking found</div>
    )
  }
/>
    

      {/* REGISTER */}
      <Route
        path="/register"
        element={<UserRegister />}
      />

      {/* LOGIN */}
      <Route
        path="/login"
        element={<UserLogin setUser={setUser} />}
      />

      {/* MECHANIC REGISTER */}
      <Route
        path="/mechanic-register"
        element={<MechanicRegister />}
      />

      
      {/* MECHANIC LOGIN */}
      <Route
        path="/mechanic-login"
        element={<MechanicLogin setMechanic={setMechanic} />}
      />

      {/* MECHANIC DASHBOARD */}
      <Route
        path="/mechanic-dashboard"
        element={<MechanicDashboard mechanic={mechanic} />}
      />

// inside Routes
<Route path="/admin" element={<AdminPanel />} />

    </Routes>
    
  );
}