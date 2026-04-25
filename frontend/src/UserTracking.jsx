import { useEffect, useState } from "react";
import socket from "./socket";

export default function UserTracking({ user }) {
  const [liveBooking, setLiveBooking] = useState(null);

  // 1️⃣ FETCH BOOKING
  useEffect(() => {
    const fetchBooking = async () => {
      if (!user?._id) return;

      const res = await fetch(
        `http://localhost:5000/api/bookings/user/${user._id}`
      );

      const data = await res.json();
      setLiveBooking(data.booking || null);
    };

    fetchBooking();
  }, [user?._id]);

  // 2️⃣ SOCKET LISTENER
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join-user", user._id);

    const handler = (data) => {
      setLiveBooking((prev) => {
        if (!prev) return prev;

        if (String(prev._id) !== String(data.bookingId)) return prev;

        return {
          ...prev,
          status: data.status,
        };
      });
    };

    socket.on("booking-status-update", handler);

    return () => socket.off("booking-status-update", handler);
  }, [user?._id]);

  if (!liveBooking) {
    return <div className="p-4">Loading tracking info...</div>;
  }

  return (
    <div className="p-4">
      <h3>🚗 Tracking Request</h3>
      <h4>Status: {liveBooking.status}</h4>
      <p>{liveBooking.issue}</p>
    </div>
  );
}