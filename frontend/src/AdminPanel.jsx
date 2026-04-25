import { useEffect, useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaUser,
  FaPhone,
  FaTools,
  FaFilter,
} from "react-icons/fa";

export default function AdminPanel() {
  const [mechanics, setMechanics] = useState([]);
  const [filter, setFilter] = useState("pending");

  // ================= FETCH =================
  const fetchMechanics = async () => {
    const url =
      filter === "pending"
        ? "https://autoassist-k2bl.onrender.com/api/admin/mechanics/pending"
        : "https://autoassist-k2bl.onrender.com/api/admin/mechanics";

    const res = await fetch(url);
    const data = await res.json();

    setMechanics(data.mechanics || []);
  };

  useEffect(() => {
    fetchMechanics();
  }, [filter]);

  // ================= APPROVE =================
  const approve = async (id) => {
    await fetch(
      `https://autoassist-k2bl.onrender.com/api/admin/mechanics/approve/${id}`,
      { method: "PUT" }
    );

    fetchMechanics();
  };

  // ================= REJECT (SOFT DELETE) =================
  const reject = async (id) => {
    await fetch(
      `https://autoassist-k2bl.onrender.com/api/admin/mechanics/reject/${id}`,
      { method: "PUT" }
    );

    fetchMechanics();
  };

  return (
    <div className="container py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Admin Panel</h3>

        {/* FILTER */}
        <div className="btn-group">
          <button
            className={`btn btn-sm ${
              filter === "pending" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>

          <button
            className={`btn btn-sm ${
              filter === "all" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
        </div>
      </div>

      {/* LIST */}
      {mechanics.length === 0 ? (
        <p className="text-muted">No mechanics found</p>
      ) : (
        mechanics.map((m) => (
          <div
            key={m._id}
            className="border rounded p-3 mb-3 bg-white shadow-sm"
          >

            {/* NAME */}
            <div className="d-flex align-items-center gap-2 mb-2">
              <FaUser />
              <strong>{m.name}</strong>
            </div>

            {/* PHONE */}
            <div className="d-flex align-items-center gap-2 mb-2">
              <FaPhone />
              {m.phone}
            </div>

            {/* SKILLS */}
            <div className="d-flex align-items-center gap-2 mb-2">
              <FaTools />
              {m.skills?.join(", ")}
            </div>

            {/* STATUS */}
            <p>
              Status:{" "}
              {m.isApproved ? (
                <span className="text-success fw-bold">Approved</span>
              ) : (
                <span className="text-warning fw-bold">Pending</span>
              )}
            </p>

            {/* ACTIONS */}
            {!m.isApproved && (
              <div className="d-flex gap-2">

                <button
                  className="btn btn-success btn-sm d-flex align-items-center gap-1"
                  onClick={() => approve(m._id)}
                >
                  <FaCheck />
                  Approve
                </button>

                <button
                  className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                  onClick={() => reject(m._id)}
                >
                  <FaTimes />
                  Reject
                </button>

              </div>
            )}

          </div>
        ))
      )}
    </div>
  );
}