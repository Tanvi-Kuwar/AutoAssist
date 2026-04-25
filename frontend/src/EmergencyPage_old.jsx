export default function EmergencyPage({ setPage, issue, setIssue }) {
  return (
    <div className="position-relative vh-100">

      {/* NAVBAR */}
      <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom bg-white position-absolute top-0 w-100"
           style={{ zIndex: 10 }}>
        <div className="fw-bold fs-5">AutoAssist</div>
        <button className="btn btn-outline-dark btn-sm rounded-pill">
          Login
        </button>
      </div>

      {/* MAP */}
      <div className="bg-dark vh-100 w-100 d-flex justify-content-center align-items-center text-white">
        <div className="text-center">
          <h5>Live Location Map</h5>
          <p className="text-secondary">Detecting nearest mechanics...</p>
        </div>
      </div>

      {/* BOTTOM SHEET */}
      <div className="position-absolute bottom-0 w-100 px-3 pb-3">

        <div className="bg-white shadow-lg rounded-5 p-4">

          <h5 className="fw-bold">Get a Ride for Help</h5>

          <input className="form-control mb-2"
                 placeholder="Pickup location (auto detected)" />

          <input className="form-control mb-3"
                 placeholder="Dropoff (optional garage)" />

          <textarea
            className="form-control mb-2"
            rows="2"
            placeholder="What happened?"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
          />

          {issue === "" && (
            <div className="border rounded-3 p-2 small text-muted mb-2">
              💡 Even if you don’t know the issue, we can detect it.
            </div>
          )}

          <div className="d-flex gap-2 flex-wrap mb-3">

            <span className="border px-3 py-1 rounded-pill small"
                  onClick={() => setIssue("Car stopped suddenly")}>
              Car stopped
            </span>

            <span className="border px-3 py-1 rounded-pill small"
                  onClick={() => setIssue("Engine issue")}>
              Engine
            </span>

            <span className="border px-3 py-1 rounded-pill small"
                  onClick={() => setIssue("Tyre issue")}>
              Tyre
            </span>

            <span className="border px-3 py-1 rounded-pill small"
                  onClick={() => setIssue("Not sure")}>
              Not sure
            </span>

          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-dark w-50 rounded-pill">
              Pickup Now
            </button>

            <button className="btn btn-outline-dark w-50 rounded-pill">
              For Me
            </button>
          </div>

          <button
            className="btn btn-light w-100 mt-2"
            onClick={() => setPage("home")}
          >
            Back
          </button>

        </div>
      </div>
    </div>
  );
}