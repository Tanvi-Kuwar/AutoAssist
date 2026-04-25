import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MechanicRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    skills: "",
    experience: "",
    lat: "",
    lng: "",
  });

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [currentPlace, setCurrentPlace] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getPlaceName = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );

    const data = await res.json();
    const addr = data.address;

    const road = addr.road || "";
    const suburb = addr.suburb || addr.neighbourhood || "";
    const city =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.county ||
      "";
    const state = addr.state || "";
    const country = addr.country || "";

    // 🔥 Build smart location string
    const parts = [];

    if (suburb) parts.push(suburb);
    if (road) parts.push(road);
    if (city) parts.push(city);
    if (state) parts.push(state);

    const final = parts.filter(Boolean).join(", ");

    return final || country || "Unknown Location";
  } catch (err) {
    console.log(err);
    return "Unknown Location";
  }
};

  // 📍 GPS LOCATION
  const getLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  setLoadingLocation(true);

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setForm((prev) => ({
        ...prev,
        lat,
        lng,
      }));

      // 🌍 GET HUMAN READABLE LOCATION
      const place = await getPlaceName(lat, lng);
      setCurrentPlace(place);

      setLoadingLocation(false);
    },
    (err) => {
      console.log(err);
      alert("Location permission denied");
      setLoadingLocation(false);
    }
  );
};


  const handleRegister = async () => {
    try {
      if (!form.name || !form.email || !form.phone || !form.password) {
        alert("Fill all required fields");
        return;
      }

      if (!form.lat || !form.lng) {
        alert("Please enable location");
        return;
      }

      const payload = {
  name: form.name,
  email: form.email,
  phone: form.phone,
  password: form.password,
  skills: form.skills
    ? form.skills.split(",").map((s) => s.trim())
    : [],
  experience: Number(form.experience) || 0,

  lat: form.lat,
  lng: form.lng,

  currentLocation: currentPlace, // 🔥 VERY IMPORTANT

  location: {
    type: "Point",
    coordinates: [Number(form.lng), Number(form.lat)],
  },
};
      const res = await fetch(
        "http://localhost:5000/api/mechanics/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registered successfully!");
      navigate("/mechanic-login");
    } catch (err) {
      console.log("REGISTER ERROR:", err);
      alert("Server error");
    }
  };

  return (
    <div
      className="vh-100 d-flex flex-column justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #000000, #1a1a1a)",
      }}
    >
      <div
        className="p-4 rounded-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#fff",
        }}
      >
        {/* HEADER */}
        <div className="text-center mb-3">
          <h3 className="fw-bold">Mechanic Register 🛠️</h3>
          <p className="text-muted small">
            Create your service account
          </p>
        </div>

        {/* INPUTS */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="form-control mb-2"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="form-control mb-2"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="form-control mb-2"
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="form-control mb-2"
        />

        <input
          name="skills"
          value={form.skills}
          onChange={handleChange}
          placeholder="Skills (comma separated)"
          className="form-control mb-2"
        />

        <input
          name="experience"
          value={form.experience}
          onChange={handleChange}
          placeholder="Experience (years)"
          className="form-control mb-2"
        />

        <div className="mb-3">

  {/* BUTTON */}
  <button
    type="button"
    className="btn w-100"
    onClick={getLocation}
    style={{ background: "#f5f5f5" }}
  >
    {loadingLocation
      ? "Fetching Location..."
      : "📍 Get My Current Location"}
  </button>

  {/* SHOW LOCATION NAME */}
  {currentPlace && (
    <p className="small text-success mt-2 mb-0">
      📍 {currentPlace}
    </p>
  )}

  {/* SUCCESS STATE */}
  {form.lat && form.lng && (
    <p className="small text-muted mt-1 mb-0">
      Location captured ✔
    </p>
  )}

</div>

         

        {/* REGISTER BUTTON */}
        <button
          className="btn w-100 fw-semibold"
          onClick={handleRegister}
          style={{
            backgroundColor: "#000",
            color: "#fff",
            padding: "10px",
          }}
        >
          Register
        </button>

        {/* BACK */}
        <button
          className="btn w-100 mt-2"
          onClick={() => navigate("/mechanic-login")}
          style={{ background: "#f5f5f5" }}
        >
          Back
        </button>
      </div>
    </div>
  );
}