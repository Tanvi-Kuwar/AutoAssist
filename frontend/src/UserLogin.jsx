import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserLogin({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",   // ✅ ADD THIS
        body: JSON.stringify({ username, password }),
      });
      console.log("STATUS:", res.status);

      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.log("JSON PARSE ERROR:", e);
        alert("Invalid server response");
        return;
      }

      console.log("PARSED:", data);

      if (!data.success) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ save user
      setUser(data.user);

      // ✅ redirect to home
      navigate("/");

    } catch (err) {
      console.log("LOGIN ERROR:", err);
      alert(err.message || "Server error");
    }
  };

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #000000, #1a1a1a)",
      }}
    >
      {/* CARD */}
      <div
        className="p-4 rounded-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "#ffffff",
        }}
      >

        {/* HEADER */}
        <div className="text-center mb-4">
          <h3 className="fw-bold mb-1">Welcome Back</h3>
          <p className="text-muted small">
            Sign in to continue with AutoAssist
          </p>
        </div>

        {/* INPUTS */}
        <div className="mb-3">
          <label className="form-label small text-muted">Username</label>
          <input
            className="form-control rounded-3"
            placeholder="Enter username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label small text-muted">Password</label>
          <input
            type="password"
            className="form-control rounded-3"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* BUTTON */}
        <button
          className="btn w-100 rounded-3 fw-semibold"
          onClick={handleLogin}
          style={{
            backgroundColor: "#000",
            color: "#fff",
            padding: "10px",
          }}
        >
          Log in
        </button>

        {/* BACK */}
        <button
          className="btn w-100 mt-2 rounded-3"
          onClick={() => navigate("/")}
          style={{
            background: "#f5f5f5",
          }}
        >
          Back
        </button>

        {/* FOOTNOTE */}
        <p className="text-center text-muted small mt-3 mb-0">
          Secure login • Fast access • Verified users only
        </p>

      </div>
    </div>
  );
}