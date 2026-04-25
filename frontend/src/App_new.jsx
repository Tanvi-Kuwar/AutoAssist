import { useState } from "react";
import EmergencyPage from "./EmergencyPage";

export default function App() {
  const [page, setPage] = useState("home");
  const [issue, setIssue] = useState("");
  const [result, setResult] = useState(null);
  const [location, setLocation] = useState(null);

  // 📍 GET LOCATION FIRST
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setLocation(loc);
        setPage("emergency");
      },
      (err) => {
        alert("Location permission denied");
        console.log(err);
      }
    );
  };

  // 🚨 EMERGENCY API CALL
  const handleEmergency = async () => {
    if (!location) {
      alert("Please select location first");
      return;
    }

    if (!issue) {
      alert("Please select an issue");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issue,
          location,
        }),
      });

      const data = await res.json();

      console.log("API RESPONSE:", data);

      setResult(data);
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  // 🧠 EMERGENCY PAGE
  if (page === "emergency") {
    return (
      <EmergencyPage
        setPage={setPage}
        issue={issue}
        setIssue={setIssue}
        handleEmergency={handleEmergency}
        result={result}
        location={location}
      />
    );
  }

  // 🏠 HOME PAGE
  return (
    <div style={{ padding: 20 }}>
      <h1>AutoAssist 🚗</h1>

      <button onClick={getLocation}>
        Emergency Help (Get Location)
      </button>
    </div>
  );
}