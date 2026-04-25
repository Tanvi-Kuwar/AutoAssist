import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import socket from "./socket";


import {
  FaOilCan,
  FaCar,
  FaBatteryFull,
  FaSnowflake,
  FaTools,
  FaCarCrash,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaTint,
  FaCogs,
  FaTruck,
  FaWrench,
  FaCarSide, 
  FaCalendarCheck, 
  FaStar, 
  FaGift,
  FaArrowRight
} from "react-icons/fa";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

export default function Home({ user, getLocation, handleLogout }) {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    if (user?._id) socket.emit("join-user", user._id);
  }, [user?._id]);

  // ✅ SERVICES DATA (LIKE GOMECHANIC)
  const services = [
    { label: "Car Service", icon: FaCar },
    { label: "Periodic Service", icon: FaCogs },
    { label: "Battery", icon: FaBatteryFull },
    { label: "AC Repair", icon: FaSnowflake },
    { label: "Engine Repair", icon: FaTools },
    { label: "Dent & Paint", icon: FaCarCrash },
    { label: "Brake Service & Inspection", icon: FaTools },
    { label: "Wheel Alignment & Balancing", icon: FaCogs },
    { label: "Wheel Care", icon: FaWrench },
    { label: "Oil Change", icon: FaOilCan },
    { label: "Towing", icon: FaTruck },
    { label: "Inspection", icon: FaMapMarkerAlt },
    { label: "Insurance", icon: FaShieldAlt },
    { label: "Car Spa", icon: FaTint },
    { label: "Doorstep Pickup & Drop", icon: FaCarSide },
    { label: "Service Packages (Savings Bundles)", icon: FaGift }
  ];

  const periodic = services.slice(0, 8);
  const valueAdded = services.slice(8);

  return (
    <div className="vh-100 w-100 bg-light overflow-auto">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center px-4 py-3 bg-white border-bottom">
        <div className="fw-bold fs-5">AutoAssist</div>

        <div className="d-flex gap-2 align-items-center">
          {!user ? (
            <>
              <button className="btn btn-outline-dark btn-sm rounded-pill"
                onClick={() => navigate("/mechanic-login")}>
                Mechanic
              </button>

              <button className="btn btn-outline-dark btn-sm rounded-pill"
                onClick={() => navigate("/login")}>
                Login
              </button>

              <button className="btn btn-dark btn-sm rounded-pill"
                onClick={() => navigate("/register")}>
                Sign up
              </button>
              
            </>
          ) : (
            <>
              <span className="fw-bold">👤 {user.username}</span>
              <button className="btn btn-dark btn-sm rounded-pill"
                onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* HERO */}
      <div className="px-4 py-5">
        <h2 className="fw-bold">Garage & Roadside Assistance Platform</h2>

        <div className="mt-3 d-flex gap-2 flex-wrap">

          <button
            className="btn btn-dark rounded-pill px-4"
            onClick={() => {
              getLocation();
              navigate("/emergency");
            }}
          >
            Emergency Help
          </button>

          <button className="btn btn-outline-dark rounded-pill px-4">
            Book Service
          </button>

          <button className="btn btn-outline-dark rounded-pill px-4">
            Fleet Solutions
          </button>

        </div>
      </div>


      {/* ================= PERIODIC SERVICES ================= */}
      <div className="px-3 mt-3">

  {/* HEADER */}
  <div className="d-flex align-items-center gap-2 mb-2">
    <FaCarSide />
    <FaCalendarCheck />
    <h6 className="fw-bold mb-0">Periodic Services</h6>
  </div>

  {/* GRID */}
  <div className="row g-2">
    {periodic.map((s, i) => {
      const Icon = s.icon;
      return (
        <div
          key={i}
          className="col-3"
          onClick={() =>
            setSelectedService({
              label: s.label,
              type: "Periodic Service",
            })
          }
          style={{ cursor: "pointer" }}
        >
          <div
            className="p-3 rounded-4 text-center"
            style={{
              background: "transparent",
              border: "none",
            }}
          >
            <Icon size={22} color="#111" />
            <div className="small mt-2">{s.label}</div>
          </div>
        </div>
      );
    })}
  </div>
</div>
      {/* ================= VALUE ADDED SERVICES ================= */}
      <div className="px-3 mt-4">

  {/* HEADER */}
  <div className="d-flex align-items-center gap-2 mb-2">
    <FaStar />
    <FaGift />
    <h6 className="fw-bold mb-0">Value Added Services</h6>
  </div>

  {/* GRID */}
  <div className="row g-2">
    {valueAdded.map((s, i) => {
      const Icon = s.icon;
      return (
        <div
          key={i}
          className="col-3"
          onClick={() =>
            setSelectedService({
              label: s.label,
              type: "Value Added Service",
            })
          }
          style={{ cursor: "pointer" }}
        >
          <div
            className="p-3 rounded-4 text-center"
            style={{
              background: "transparent",
              border: "none",
            }}
          >
            <Icon size={22} color="#111" />
            <div className="small mt-2">{s.label}</div>
          </div>
        </div>
      );
    })}
  </div>
</div>
      

      {/* ================= JOIN MECHANIC (FIXED CTA SECTION) ================= */}
<div className="mt-5 mx-3 mb-5">

  <div
    className="bg-black text-white rounded-4 p-4 p-md-5"
    style={{
      border: "1px solid #222",
    }}
  >

    {/* TOP SMALL LABEL */}
    <p className="text-uppercase small mb-2" style={{ letterSpacing: "3px", color: "#aaa" }}>
      For Mechanics
    </p>

    {/* MAIN HEADING */}
    <h2 className="fw-bold mb-2">
      Run your own dispatch board.
    </h2>

    {/* SUB TEXT */}
    <p className="text-white-50 mb-4" style={{ maxWidth: "500px" }}>
      Get real-time booking requests in your service area and grow your workshop faster.
    </p>

    {/* FEATURES ROW (OPTIONAL POLISH) */}
    <div className="d-flex flex-wrap gap-3 mb-4 text-white-50 small">
      <span>✔ Live Requests</span>
      <span>✔ Verified Customers</span>
      <span>✔ Secure Payments</span>
    </div>

    {/* BUTTON */}
    <button
      className="btn btn-light px-4 py-2 d-flex align-items-center gap-2 fw-semibold"
      onClick={() => navigate("/mechanic-register")}
      style={{
        borderRadius: "30px",
      }}
    >
      JOIN AS MECHANIC
      <FaArrowRight />
    </button>
  </div>
</div>


{selectedService && (
  <div
    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
    style={{ background: "rgba(0,0,0,0.6)", zIndex: 9999 }}
    onClick={() => setSelectedService(null)}
  >
    <div
      className="bg-white p-4 rounded-4 shadow"
      style={{ width: "90%", maxWidth: "420px" }}
      onClick={(e) => e.stopPropagation()}
    >

      <h5 className="fw-bold mb-3">
        {selectedService.label}
      </h5>

      {/* SERVICE TYPE */}
      <input
        className="form-control mb-2"
        value={selectedService.type}
        disabled
      />

      {/* DATE */}
      <label className="small text-muted">Appointment Date</label>
      <input type="date" className="form-control mb-2" />

      {/* TIME */}
      <label className="small text-muted">Time</label>
      <input type="time" className="form-control mb-2" />

      {/* VEHICLE */}
      <input
        className="form-control mb-2"
        placeholder="Vehicle Type (Car/Bike)"
      />

      {/* MODEL */}
      <input
        className="form-control mb-2"
        placeholder="Vehicle Model"
      />

      {/* ISSUE */}
      <textarea
        className="form-control mb-3"
        placeholder="Describe your issue"
        rows={3}
      />

      {/* BUTTONS */}
      <div className="d-flex gap-2">

        <button
          className="btn btn-dark w-100"
          onClick={() => {
            alert("Service booked!");
            setSelectedService(null);
          }}
        >
          Confirm Booking
        </button>

        <button
          className="btn btn-outline-dark w-100"
          onClick={() => setSelectedService(null)}
        >
          Cancel
        </button>

      </div>

    </div>
  </div>
)}
    </div>
  );
}











