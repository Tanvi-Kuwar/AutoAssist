import { useEffect, useState } from "react";
import socket from "./socket";

import {
  FaUser,
  FaPhone,
  FaCar,
  FaHashtag,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSignOutAlt,
  FaPowerOff,
} from "react-icons/fa";

export default function MechanicDashboard({ mechanic, setPage }) {
  const [bookings, setBookings] = useState([]);
  const [isOnline, setIsOnline] = useState(mechanic?.isOnline || false);
  const [showStatus, setShowStatus] = useState(false);
  const [statusData, setStatusData] = useState(null);

  const mechanicId = mechanic?._id;

  // ================= SOCKET UPDATE =================
  useEffect(() => {
    const handleUpdate = (data) => {
      setBookings((prev) =>
        prev.map((b) =>
          b._id === data.bookingId
            ? { ...b, status: data.status }
            : b
        )
      );
    };

    socket.on("booking-status-update", handleUpdate);

    return () => socket.off("booking-status-update", handleUpdate);
  }, []);

  // ================= JOIN ROOM =================
  useEffect(() => {
    if (mechanicId) socket.emit("join-mechanic", mechanicId);
  }, [mechanicId]);

  // ================= FETCH BOOKINGS =================
  const fetchBookings = async () => {
    const res = await fetch(
      `http://localhost:5000/api/bookings/${mechanicId}`
    );
    const data = await res.json();
    setBookings(data.bookings || []);
  };

  useEffect(() => {
    if (mechanicId) fetchBookings();
  }, [mechanicId]);

  // ================= NEW BOOKING =================
  useEffect(() => {
    const handleNew = (booking) => {
      if (booking.mechanicId === mechanicId) {
        setBookings((prev) => [booking, ...prev]);
      }
    };

    socket.on("new-booking", handleNew);

    return () => socket.off("new-booking", handleNew);
  }, [mechanicId]);

  // ================= STATUS UPDATE =================
  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    fetchBookings();
  };

  // ================= TOGGLE ONLINE =================
  const toggleOnline = async () => {
  if (!mechanic?.location?.coordinates) return;

  const newStatus = !isOnline;
  setIsOnline(newStatus);

  await fetch(
    `http://localhost:5000/api/mechanics/location/${mechanicId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lat: mechanic.location.coordinates?.[1],
        lng: mechanic.location.coordinates?.[0],
        isOnline: newStatus,
      }),
    }
  );
};
  // ================= STATUS CONFIG =================
  const statusConfig = (status) => {
    if (status === "pending")
      return { color: "#6b7280", bg: "#f3f4f6", icon: FaClock };

    if (status === "accepted")
      return { color: "#16a34a", bg: "#ecfdf5", icon: FaCheckCircle };

    if (status === "rejected")
      return { color: "#dc2626", bg: "#fef2f2", icon: FaTimesCircle };

    return { color: "#6b7280", bg: "#f3f4f6", icon: FaClock };
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>

      {/* ================= NAVBAR ================= */}
      <div className="d-flex justify-content-between align-items-center px-4 py-3 bg-white border-bottom">

        <div className="fw-bold fs-5">
          AutoAssist 
        </div>

        <div className="d-flex gap-2 align-items-center">

          {/* ONLINE BUTTON */}
          <button
            className={`btn btn-sm rounded-pill d-flex align-items-center gap-1 ${
              isOnline ? "btn-success" : "btn-secondary"
            }`}
            onClick={toggleOnline}
          >
            <FaPowerOff />
            {isOnline ? "Online" : "Offline"}
          </button>

          <button
  className="btn btn-outline-dark btn-sm rounded-pill"
  onClick={async () => {
    if (!mechanic?._id) return;

    setShowStatus(true);
    setStatusData(null);

    try {
      const res = await fetch(
        `http://localhost:5000/api/mechanics/status/${mechanic._id}`
      );

      const data = await res.json();
      setStatusData(data);
    } catch (err) {
      console.log(err);
      setStatusData({ status: "error" });
    }
  }}
>
  Approval Status
</button>
          {/* NAME */}
          {mechanic && (
            <span className="fw-bold">
              <FaUser className="me-1" />
              {mechanic.name}
            </span>
          )}

          {/* LOGOUT */}
          <button
            className="btn btn-dark btn-sm rounded-pill d-flex align-items-center gap-1"
            onClick={() => setPage("home")}
          >
            <FaSignOutAlt />
            Logout
          </button>

        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>

        {bookings.length === 0 ? (
          <p className="text-muted">No service requests</p>
        ) : (
          bookings.map((b) => {
            const cfg = statusConfig(b.status);
            const Icon = cfg.icon;

            return (
              <div
                key={b._id}
                className="bg-white border rounded-3 p-3 mb-3 shadow-sm"
              >

                {/* USER */}
                <div className="d-flex align-items-center gap-2 mb-2">
                  <FaUser />
                  <strong>{b.user?.name}</strong>
                </div>

                {/* PHONE */}
                <div className="d-flex align-items-center gap-2 mb-2">
                  <FaPhone />
                  {b.user?.phone}
                </div>

                {/* VEHICLE */}
                <div className="d-flex align-items-center gap-2 mb-2">
                  <FaCar />
                  {b.vehicle?.type} • {b.vehicle?.model}
                </div>

                {/* NUMBER */}
                <div className="d-flex align-items-center gap-2 mb-2">
                  <FaHashtag />
                  {b.vehicle?.number}
                </div>

                {/* ISSUE */}
                <p className="mb-2">{b.issue}</p>

                {/* LOCATION */}
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <FaMapMarkerAlt />
                  {b.location?.lat?.toFixed(4)}, {b.location?.lng?.toFixed(4)}
                </div>

                {/* STATUS */}
                <div
                  className="d-inline-flex align-items-center gap-1 mt-2 px-2 py-1 rounded-pill"
                  style={{
                    background: cfg.bg,
                    color: cfg.color,
                    fontSize: 12,
                  }}
                >
                  <Icon />
                  {b.status}
                </div>

                {/* ACTIONS */}
                {b.status === "pending" && (
                  <div className="d-flex gap-2 mt-3">

                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => updateStatus(b._id, "accepted")}
                    >
                      Accept
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => updateStatus(b._id, "rejected")}
                    >
                      Reject
                    </button>

                  </div>
                )}

              </div>
            );
          })
        )}

      </div>
      {showStatus && (
  <div
    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
    style={{ background: "rgba(0,0,0,0.5)", zIndex: 9999 }}
    onClick={() => setShowStatus(false)}
  >
    <div
      className="bg-white p-4 rounded shadow"
      style={{ minWidth: "300px" }}
      onClick={(e) => e.stopPropagation()}
    >

      <h5 className="mb-3">Approval Status</h5>

      {!statusData ? (
        <p>Loading...</p>
      ) : statusData.status === "approved" ? (
        <div className="text-success fw-bold">
          Approved by Admin
        </div>
      ) : statusData.status === "pending" ? (
        <div className="text-warning fw-bold">
          Waiting for Admin Approval
        </div>
      ) : statusData.status === "deleted" ? (
        <div className="text-danger fw-bold">
          Account Deleted by Admin
        </div>
      ) : (
        <div className="text-danger fw-bold">
          Error fetching status
        </div>
      )}

      <button
        className="btn btn-dark btn-sm mt-3 w-100"
        onClick={() => setShowStatus(false)}
      >
        Close
      </button>

    </div>
  </div>
)}
    </div>

    
  );
}