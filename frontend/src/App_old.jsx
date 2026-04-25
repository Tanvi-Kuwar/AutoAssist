import { useState } from "react";
import EmergencyPage from "./EmergencyPage";

export default function App() {
  const [mode, setMode] = useState("home");

  // ✅ added (required for page switching)
  const [page, setPage] = useState("home");
  const [issue, setIssue] = useState("");

  return (
    <div className="vh-100 w-100 bg-white overflow-auto">

      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
        <div className="fw-bold fs-5">AutoAssist</div>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-dark btn-sm rounded-pill">
            Log in
          </button>
          <button className="btn btn-dark btn-sm rounded-pill">
            Sign up
          </button>
        </div>
      </div>

      {/* ================= HERO SECTION ================= */}
      <div className="px-4 py-5">
        <h2 className="fw-bold">Garage & Roadside Assistance Platform</h2>
        <p className="text-muted">
          Request emergency help or schedule your vehicle service instantly
        </p>

        <div className="mt-3 d-flex gap-2 flex-wrap">

          {/* ✅ ONLY CHANGE HERE */}
          <button
  className="btn btn-dark rounded-pill px-4"
  onClick={() => setPage("emergency")}
>
  Emergency Help
</button>
          <button
            className="btn btn-outline-dark rounded-pill px-4"
            onClick={() => setMode("booking")}
          >
            Book Service
          </button>

          <button className="btn btn-outline-dark rounded-pill px-4">
            Fleet Solutions
          </button>

        </div>
      </div>

      {/* ================= QUICK SERVICES ================= */}
      <div className="px-4 py-3">

        <h5 className="fw-bold">Services</h5>

        <div className="d-flex gap-2 overflow-auto py-2">

          {[
            "Battery",
            "Tyre",
            "Engine",
            "Towing",
            "AC Repair",
            "Inspection"
          ].map((s) => (
            <span
              key={s}
              className="border px-3 py-2 rounded-pill text-nowrap"
            >
              {s}
            </span>
          ))}

        </div>
      </div>

      {/* ================= FEATURE GRID ================= */}
      <div className="px-4 py-4">

        <div className="row g-3">

          <div className="col-md-4">
            <div className="border rounded-4 p-3 h-100">
              <h6 className="fw-bold">Instant Assistance</h6>
              <p className="text-muted small">
                Connect with nearby mechanics in real-time
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="border rounded-4 p-3 h-100">
              <h6 className="fw-bold">Scheduled Service</h6>
              <p className="text-muted small">
                Book garage appointments in advance
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="border rounded-4 p-3 h-100">
              <h6 className="fw-bold">Fleet Management</h6>
              <p className="text-muted small">
                Business solutions for companies
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ================= INFO SECTIONS ================= */}
      <div className="px-4 py-5 border-top">

        <h5 className="fw-bold">Why AutoAssist</h5>

        <div className="row mt-3">

          <div className="col-md-6 mb-3">
            <h6>700+ service zones</h6>
            <p className="text-muted small">
              Mechanics available across cities
            </p>
          </div>

          <div className="col-md-6 mb-3">
            <h6>Real-time tracking</h6>
            <p className="text-muted small">
              Live mechanic location updates
            </p>
          </div>

          <div className="col-md-6 mb-3">
            <h6>Fast emergency response</h6>
            <p className="text-muted small">
              Average response under 10 minutes
            </p>
          </div>

          <div className="col-md-6 mb-3">
            <h6>Trusted mechanics</h6>
            <p className="text-muted small">
              Verified professionals only
            </p>
          </div>

        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="border-top px-4 py-4">

        <div className="row">

          <div className="col-md-3">
            <h6>Company</h6>
            <p className="text-muted small">About • Careers • Blog</p>
          </div>

          <div className="col-md-3">
            <h6>Services</h6>
            <p className="text-muted small">Emergency • Booking • Fleet</p>
          </div>

          <div className="col-md-3">
            <h6>Support</h6>
            <p className="text-muted small">Help Center • Safety</p>
          </div>

          <div className="col-md-3">
            <h6>Download</h6>
            <p className="text-muted small">Android • iOS App</p>
          </div>

        </div>

        <div className="text-center text-muted small mt-3">
          © 2026 AutoAssist Technologies
        </div>

      </div>

      {/* ================= EMERGENCY PAGE ================= */}
      {page === "emergency" && (
        <EmergencyPage
          setPage={setPage}
          issue={issue}
          setIssue={setIssue}
        />
      )}

    </div>
  );
}

