import { useNavigate } from "react-router-dom";

export default function Navbar({ user, handleLogout }) {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
      
      {/* LOGO */}
      <div
        className="fw-bold fs-5"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        AutoAssist
      </div>

      {/* RIGHT SIDE BUTTONS */}
      <div className="d-flex gap-2 align-items-center">

        {!user ? (
          <>
            <button
              className="btn btn-outline-dark rounded-pill px-4"
              onClick={() => navigate("/mechanic-login")}
            >
              Mechanic Login
            </button>

            <button
              className="btn btn-outline-dark btn-sm rounded-pill"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>

            <button className="btn btn-dark btn-sm rounded-pill">
              Sign up
            </button>
          </>
        ) : (
          <>
            <span className="fw-bold">👤 {user.username}</span>

            <button
              className="btn btn-dark btn-sm rounded-pill"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}

      </div>
    </div>
  );
}