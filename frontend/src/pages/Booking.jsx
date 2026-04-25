import { useState } from "react";
import axios from "axios";

export default function Booking() {
  const [form, setForm] = useState({
    serviceId: "",
    date: "",
    time: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBooking = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/book", form);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Book Service</h2>

      {/* Service */}
      <select name="serviceId" onChange={handleChange}>
        <option value="">Select Service</option>
        <option value="service1">Oil Change</option>
        <option value="service2">Brake Repair</option>
      </select>

      <br /><br />

      {/* Date */}
      <input type="date" name="date" onChange={handleChange} />

      <br /><br />

      {/* Time */}
      <select name="time" onChange={handleChange}>
        <option>09:00</option>
        <option>10:00</option>
        <option>11:00</option>
      </select>

      <br /><br />

      <button onClick={handleBooking}>Book Now</button>
    </div>
  );
}