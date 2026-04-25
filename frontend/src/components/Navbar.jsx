import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div style={{ padding: "10px", background: "#eee" }}>
      <Link to="/">Register</Link> |{" "}
      <Link to="/login">Login</Link> |{" "}
      <Link to="/booking">Booking</Link>
    </div>
  );
}