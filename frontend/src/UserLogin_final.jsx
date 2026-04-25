import { useState } from "react";

export default function UserLogin({ setUser, setPage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Enter credentials");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      console.log("LOGIN SUCCESS:", data);

      setUser(data.user); // 🔥 store logged-in user
      setPage("home");

    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center">

      <h3 className="fw-bold mb-3">User Login 👤</h3>

      <input
        className="form-control mb-2"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        style={{ maxWidth: 300 }}
      />

      <input
        type="password"
        className="form-control mb-2"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ maxWidth: 300 }}
      />

      <button
        className="btn btn-dark rounded-pill px-4"
        onClick={handleLogin}
      >
        Login
      </button>

      <button
        className="btn btn-light mt-2"
        onClick={() => setPage("home")}
      >
        Back
      </button>
    </div>
  );
}