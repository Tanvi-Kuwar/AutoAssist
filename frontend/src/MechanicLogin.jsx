import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MechanicLogin({ setMechanic }) {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!phone) {
        alert("Enter phone number");
        return;
      }

      const res = await fetch("http://localhost:5000/api/mechanics/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      console.log("STATUS:", res.status);

      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        alert("Invalid server response");
        return;
      }

      if (!data.success) {
        alert(data.message || "Login failed");
        return;
      }

      // save mechanic
      setMechanic(data.mechanic);

      // redirect
      navigate("/mechanic-dashboard");

    } catch (err) {
      console.log("MECHANIC LOGIN ERROR:", err);
      alert("Server error");
    }
  };

  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #000000, #1a1a1a)",
      }}
    >
      <div
        className="p-4 rounded-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "#fff",
        }}
      >

        {/* HEADER */}
        <div className="text-center mb-3">
          <h3 className="fw-bold">Mechanic Login 🔧</h3>
          <p className="text-muted small">
            Access your service dashboard
          </p>
        </div>

        {/* INPUT */}
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          className="form-control mb-3"
        />

        {/* BUTTON */}
        <button
          className="btn w-100 fw-semibold"
          onClick={handleLogin}
          style={{
            backgroundColor: "#000",
            color: "#fff",
            padding: "10px",
          }}
        >
          Login
        </button>

        {/* BACK */}
        <button
          className="btn w-100 mt-2"
          onClick={() => navigate("/")}
          style={{ background: "#f5f5f5" }}
        >
          Back
        </button>

      </div>
    </div>
  );
}