import { useState } from "react";

export default function EmergencyPage({
  setPage,
  issue,
  setIssue,
  handleEmergency,
  result,
  location,
}) {
  const [showLocations, setShowLocations] = useState(false);

  // 📍 sample saved locations
  const savedLocations = [
    { name: "Home", lat: 18.60, lng: 73.80 },
    { name: "Office", lat: 18.62, lng: 73.85 },
    { name: "Shop", lat: 18.65, lng: 73.78 },
  ];

  // 📍 current location
  const useCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({
        name: "Current Location",
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });

      setShowLocations(false);
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Emergency Page 🚨</h2>

      {/* 📍 LOCATION SELECTOR */}
      <div
        onClick={() => setShowLocations(!showLocations)}
        style={{
          border: "1px solid black",
          padding: 10,
          cursor: "pointer",
          marginBottom: 10,
        }}
      >
        {location ? (
          <>
            📍 {location.name || "Selected Location"}
            <br />
            <small>
              {location.lat?.toFixed(4)}, {location.lng?.toFixed(4)}
            </small>
          </>
        ) : (
          "Select Location"
        )}
      </div>

      {/* 📍 DROPDOWN */}
      {showLocations && (
        <div style={{ border: "1px solid gray", padding: 10 }}>
          <div
            onClick={useCurrentLocation}
            style={{ fontWeight: "bold", cursor: "pointer" }}
          >
            📍 Use my current location
          </div>

          <hr />

          {savedLocations.map((loc, i) => (
            <div
              key={i}
              onClick={() => {
                setLocation(loc);
                setShowLocations(false);
              }}
              style={{ cursor: "pointer", padding: 5 }}
            >
              📌 {loc.name}
            </div>
          ))}
        </div>
      )}

      {/* 🚗 ISSUE */}
      <h4>Select Issue</h4>

      <button onClick={() => setIssue("Car stopped")}>
        Car stopped
      </button>

      <button onClick={() => setIssue("Engine issue")}>
        Engine issue
      </button>

      <button onClick={() => setIssue("Tyre issue")}>
        Tyre issue
      </button>

      <p>
        <b>Selected:</b> {issue || "None"}
      </p>

      {/* 🚨 REQUEST BUTTON */}
      <button
        onClick={handleEmergency}
        style={{
          marginTop: 10,
          padding: 10,
          background: "black",
          color: "white",
        }}
      >
        Request Help
      </button>

      <button onClick={() => setPage("home")}>
        Back
      </button>

      {/* 🛠 RESULT */}
      {result?.mechanics?.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Nearby Mechanics 🛠</h3>

          {result.mechanics.map((m, i) => (
            <div key={i} style={{ borderBottom: "1px solid #ddd" }}>
              <b>{m.name}</b>
              <p>Distance: {m.distance?.toFixed(2)} km</p>
              <p>Rating: ⭐ {m.rating}</p>
              <p>Phone: {m.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}