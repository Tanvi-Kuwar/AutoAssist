import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LiveMap from "./LiveMap";

export default function EmergencyPage({
  setPage,
  issue,
  setIssue,
  handleEmergency,
  result,
  location,
  setLocation,
  user,
  setBooking, // ✅ FIXED: required for tracking flow
}) {
  const [showLocations, setShowLocations] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate(); // ✅ for routing

  const [form, setForm] = useState({
    vehicle: "",
    model: "",
    number: "",
    notes: "",
  });

  // 📍 DISTANCE CALCULATION
  const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lat2) return 0;

    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // 📍 CURRENT LOCATION
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

  // 🚨 BOOKING HANDLER (FIXED)
  const handleBooking = async () => {
  if (!selectedMechanic) {
    alert("Select a mechanic first");
    return;
  }

  if (!user?._id) {
    alert("User not logged in");
    return;
  }

  if (!form.vehicle || !form.model || !form.number) {
    alert("Fill all vehicle details");
    return;
  }

  const bookingData = {
    user: {
      _id: user._id,           // 🔥 REQUIRED FIX
      name: user.username,
      phone: user.phone || "0000000000",
    },

    mechanicId: selectedMechanic._id,

    issue,

    location,

    vehicle: {
      type: form.vehicle,
      model: form.model,
      number: form.number,
    },

    notes: form.notes,

    status: "pending",
  };

  try {
    const res = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    const data = await res.json();

    if (!data.booking) {
      alert("Booking failed");
      return;
    }

    // ✅ SAVE BOOKING
    setBooking(data.booking);

    // ✅ SAFE NAVIGATION (recommended)
    navigate("/tracking", {
      state: { booking: data.booking },
    });

  } catch (err) {
    console.log(err);
    alert("Server error");
  }
};
  return (
    <div className="vh-100 d-flex flex-column">

      {/* NAVBAR */}
      <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom bg-white">
        <div className="fw-bold fs-5">AutoAssist</div>

        {!user ? (
          <button
            className="btn btn-outline-dark btn-sm rounded-pill"
            onClick={() => setPage("user-login")}
          >
            Login
          </button>
        ) : (
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold">👤 {user.username}</span>
            <button
              className="btn btn-dark btn-sm rounded-pill"
              onClick={() => window.location.reload()}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* MAP */}
      <div style={{ height: "40vh", width: "100%" }}>
        {location ? (
          <LiveMap location={location} />
        ) : (
          <div className="text-center p-3">📍 Fetching location...</div>
        )}
      </div>

      {/* BOTTOM SHEET */}
      <div className="bg-white shadow-lg rounded-top-4 p-3 flex-grow-1 overflow-auto">

        {!showForm ? (
          <>
            <h5 className="fw-bold mb-3">🚨 Get Help</h5>

            {/* LOCATION */}
            <div
              className="border rounded p-2 mb-2"
              onClick={() => setShowLocations(!showLocations)}
              style={{ cursor: "pointer" }}
            >
              {location?.lat
                ? `📍 ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                : "Select Location"}
            </div>

            {showLocations && (
              <div className="border p-2 mb-2">
                <div
                  className="fw-bold"
                  onClick={useCurrentLocation}
                  style={{ cursor: "pointer" }}
                >
                  📍 Use current location
                </div>
              </div>
            )}

            {/* ISSUE */}
            <textarea
              className="form-control mb-2"
              placeholder="What happened?"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
            />

            {/* QUICK OPTIONS */}
            <div className="d-flex gap-2 flex-wrap mb-3">
              {["Car stopped", "Engine", "Tyre", "Battery"].map((i) => (
                <span
                  key={i}
                  className="border px-3 py-1 rounded-pill"
                  style={{ cursor: "pointer" }}
                  onClick={() => setIssue(i)}
                >
                  {i}
                </span>
              ))}
            </div>

            {/* FIND MECHANICS */}
            <button
              className="btn btn-dark w-100 mb-3"
              onClick={handleEmergency}
            >
              Find Mechanics
            </button>

            {/* RESULTS */}
            {result?.mechanics?.map((m) => {
              const mechLat =
                m.location?.lat || m.location?.coordinates?.[1];
              const mechLng =
                m.location?.lng || m.location?.coordinates?.[0];

              const distance =
                m.distance ||
                (mechLat && mechLng
                  ? getDistance(
                      location?.lat,
                      location?.lng,
                      mechLat,
                      mechLng
                    )
                  : 0);

              return (
                <div key={m._id} className="border rounded p-3 mb-2">

                  <div className="d-flex justify-content-between">
                    <b>{m.name}</b>
                    <span>⭐ {m.rating || "4.5"}</span>
                  </div>

                  <div className="text-muted small">
                    📍 {distance.toFixed(2)} km away
                  </div>

                  <button
                    className="btn btn-sm btn-dark mt-2 w-100"
                    onClick={() => {
                      setSelectedMechanic(m);
                      setShowForm(true);
                    }}
                  >
                    Book Now
                  </button>
                </div>
              );
            })}
          </>
        ) : (
          <>
            <h5 className="fw-bold">Book Appointment</h5>

            <p className="small">
              Mechanic: <b>{selectedMechanic?.name}</b>
            </p>

            <input
              className="form-control mb-2"
              placeholder="Vehicle Type"
              onChange={(e) =>
                setForm({ ...form, vehicle: e.target.value })
              }
            />

            <input
              className="form-control mb-2"
              placeholder="Model"
              onChange={(e) =>
                setForm({ ...form, model: e.target.value })
              }
            />

            <input
              className="form-control mb-2"
              placeholder="Vehicle Number"
              onChange={(e) =>
                setForm({ ...form, number: e.target.value })
              }
            />

            <textarea
              className="form-control mb-3"
              placeholder="Additional Notes"
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
            />

            <button
              className="btn btn-dark w-100"
              onClick={handleBooking}
            >
              Confirm Booking
            </button>

            <button
              className="btn btn-light w-100 mt-2"
              onClick={() => setShowForm(false)}
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}