import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// create socket ONLY ONCE
const socket = io("https://autoassist-k2bl.onrender.com", {
  transports: ["websocket"],
});

export default function LiveMap({ location }) {
  const [mechanics, setMechanics] = useState([]);

  useEffect(() => {
    const handler = (data) => {
      setMechanics((prev) => {
        const filtered = prev.filter(
          (m) => m.mechanicId !== data.mechanicId
        );
        return [...filtered, data];
      });
    };

    socket.on("mechanic-location", handler);

    return () => socket.off("mechanic-location", handler);
  }, []);

  // ✅ SAFE CHECK (THIS FIXES BLANK SCREEN)
  if (!location?.lat || !location?.lng) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <h6>Loading map...</h6>
      </div>
    );
  }

  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={14}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[location.lat, location.lng]}>
        <Popup>You are here</Popup>
      </Marker>

      {mechanics.map((m) => (
        <Marker key={m.mechanicId} position={[m.lat, m.lng]}>
          <Popup>{m.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}