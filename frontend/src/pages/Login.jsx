import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form,
        { withCredentials: true }
      );

      alert(res.data.message);
      console.log(res.data.user);

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">

      <div className="card shadow-lg p-4" style={{ width: "380px", borderRadius: "20px" }}>

        <h3 className="text-center mb-3">Welcome Back</h3>

        <form onSubmit={handleLogin}>

          {/* Username */}
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              name="username"
              className="form-control"
              placeholder="Enter username"
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Enter password"
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-dark w-100 rounded-pill">
            🚀 Login
          </button>

        </form>

      </div>
    </div>
  );
}