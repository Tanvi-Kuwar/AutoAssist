import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserRegister() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      if (!username || !email || !phone || !password) {
        alert("Please fill all fields");
        return;
      }

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          phone,
          password,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration successful 🚀");

      // redirect to login
      navigate("/login");

    } catch (err) {
      console.log("REGISTER ERROR:", err);
      alert("Server error");
    }
  };

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #000000, #1a1a1a)",
      }}
    >
      <div
        className="p-4 rounded-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
        }}
      >
        {/* HEADER */}
        <div className="text-center mb-4">
          <h3 className="fw-bold">Create Account</h3>
          <p className="text-muted small">
            Join AutoAssist in seconds
          </p>
        </div>

        {/* INPUTS */}
        <input
          className="form-control mb-2"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="Phone"
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* BUTTON */}
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

        {/* LOGIN LINK */}
        <button
          className="btn w-100 mt-2"
          onClick={() => navigate("/login")}
          style={{ background: "#f5f5f5" }}
        >
          Already have an account? Login
        </button>

        <p className="text-center text-muted small mt-3 mb-0">
          Secure signup • Fast onboarding • Verified users only
        </p>
      </div>
    </div>
  );
}