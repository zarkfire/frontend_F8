import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/restaurants", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRestaurants(data);
    } catch {
      setError("Impossible de charger les restaurants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

        .resto-root {
          font-family: 'DM Sans', sans-serif;
          background: #0e0d0b;
          color: #e8e2d8;
          min-height: 100vh;
        }

        .resto-layout {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* HEADER */
        .resto-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 0 24px;
          border-bottom: 1px solid #2e2b26;
          animation: fadeDown 0.6s ease both;
        }

        .resto-logo {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }

        .resto-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #f5f0e8;
          letter-spacing: 0.02em;
        }

        .resto-logo-badge {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #c9a84c;
          border: 1px solid #c9a84c;
          padding: 2px 8px;
          border-radius: 2px;
        }

        .resto-btn-back {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px solid #2e2b26;
          color: #6b6456;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          padding: 8px 16px;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .resto-btn-back:hover {
          border-color: #c9a84c;
          color: #c9a84c;
          background: rgba(201,168,76,0.06);
        }

        /* MAIN */
        .resto-main {
          padding: 40px 0 60px;
        }

        .resto-welcome {
          animation: fadeUp 0.5s 0.1s ease both;
          margin-bottom: 40px;
        }

        .resto-welcome-label {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 10px;
        }

        .resto-welcome-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 700;
          color: #f5f0e8;
          line-height: 1.15;
        }

        .resto-welcome-title span { color: #c9a84c; }

        /* SECTION */
        .resto-section {
          background: #191714;
          border: 1px solid #2e2b26;
          border-radius: 8px;
          overflow: hidden;
          animation: fadeUp 0.5s 0.2s ease both;
        }

        .resto-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #2e2b26;
        }

        .resto-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          color: #f5f0e8;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .resto-section-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          background: #211f1b;
          border: 1px solid #2e2b26;
          color: #6b6456;
          padding: 2px 10px;
          border-radius: 20px;
        }

        .resto-btn-refresh {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px solid #2e2b26;
          color: #6b6456;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          padding: 8px 16px;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .resto-btn-refresh:hover {
          border-color: #c9a84c;
          color: #c9a84c;
        }

        /* RESTAURANT CARDS */
        .resto-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }

        .resto-card {
          position: relative;
          padding: 24px;
          border-bottom: 1px solid #2e2b26;
          border-right: 1px solid #2e2b26;
          transition: background 0.2s;
          animation: fadeIn 0.3s ease both;
        }

        .resto-card:nth-child(even) { border-right: none; }
        .resto-card:nth-last-child(-n+2) { border-bottom: none; }
        .resto-card:nth-last-child(1):nth-child(odd) { border-bottom: none; }

        .resto-card:hover { background: #211f1b; }

        .resto-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 2px;
          height: 0;
          background: #2e7d5e;
          transition: height 0.3s;
        }

        .resto-card:hover::before { height: 100%; }

        .resto-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .resto-card-icon {
          width: 42px;
          height: 42px;
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(46,125,94,0.2), rgba(201,168,76,0.1));
          border: 1px solid #2e2b26;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .resto-card-id {
          font-size: 11px;
          color: #3a3630;
          font-weight: 500;
          letter-spacing: 0.05em;
        }

        .resto-card-name {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          color: #f5f0e8;
          margin-bottom: 6px;
        }

        .resto-card-address {
          font-size: 12px;
          color: #6b6456;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .resto-card-desc {
          font-size: 13px;
          color: #5a5248;
          line-height: 1.5;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .resto-btn-menu {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px solid #2e7d5e;
          color: #6ecfa6;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          padding: 7px 14px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.03em;
        }

        .resto-btn-menu:hover {
          background: rgba(46,125,94,0.15);
          border-color: #6ecfa6;
          transform: translateX(3px);
        }

        /* STATUS */
        .resto-status-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 24px;
          background: #211f1b;
          border-top: 1px solid #2e2b26;
          font-size: 12px;
          color: #6b6456;
        }

        .resto-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2e7d5e;
          box-shadow: 0 0 6px #2e7d5e;
        }

        /* EMPTY / LOADING */
        .resto-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
          color: #6b6456;
          font-size: 14px;
          gap: 10px;
        }

        .resto-empty-icon { font-size: 36px; opacity: 0.4; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .resto-spinner {
          width: 20px; height: 20px;
          border: 2px solid #2e2b26;
          border-top-color: #c9a84c;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @media (max-width: 640px) {
          .resto-grid { grid-template-columns: 1fr; }
          .resto-card { border-right: none; }
          .resto-card:nth-last-child(-n+2) { border-bottom: 1px solid #2e2b26; }
          .resto-card:last-child { border-bottom: none; }
          .resto-welcome-title { font-size: 26px; }
        }
      `}</style>

      <div className="resto-root">
        <div className="resto-layout">
          {/* Header */}
          <header className="resto-header">
            <div className="resto-logo">
              <span className="resto-logo-text">Restaurants</span>
              <span className="resto-logo-badge">Catalogue</span>
            </div>
            <button className="resto-btn-back" onClick={() => navigate("/home")}>
              ← Retour
            </button>
          </header>

          <main className="resto-main">
            <div className="resto-welcome">
              <p className="resto-welcome-label">Établissements</p>
              <h1 className="resto-welcome-title">
                Nos <span>restaurants</span>
              </h1>
            </div>

            <div className="resto-section">
              <div className="resto-section-header">
                <div className="resto-section-title">
                  Liste des établissements
                  <span className="resto-section-count">
                    {restaurants.length > 0 ? restaurants.length : "—"}
                  </span>
                </div>
                <button className="resto-btn-refresh" onClick={fetchRestaurants}>
                  ↻ Actualiser
                </button>
              </div>

              {loading ? (
                <div className="resto-empty">
                  <div className="resto-spinner" />
                  <span>Chargement…</span>
                </div>
              ) : error ? (
                <div className="resto-empty" style={{ color: "#e87070" }}>
                  <span className="resto-empty-icon">⚠</span>
                  <span>{error}</span>
                </div>
              ) : restaurants.length === 0 ? (
                <div className="resto-empty">
                  <span className="resto-empty-icon">🍽️</span>
                  <span>Aucun restaurant trouvé</span>
                </div>
              ) : (
                <div className="resto-grid">
                  {restaurants.map((r, i) => (
                    <div
                      className="resto-card"
                      key={r.id}
                      style={{ animationDelay: `${i * 0.07}s` }}
                    >
                      <div className="resto-card-top">
                        <div className="resto-card-icon">🍽️</div>
                        <span className="resto-card-id">#{r.id}</span>
                      </div>
                      <div className="resto-card-name">{r.name}</div>
                      {r.address && (
                        <div className="resto-card-address">
                          <span>📍</span> {r.address}
                        </div>
                      )}
                      {r.description && (
                        <div className="resto-card-desc">{r.description}</div>
                      )}
                      <button
                        className="resto-btn-menu"
                        onClick={() => navigate(`/restaurants/${r.id}/menus`)}
                      >
                        Voir le menu →
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="resto-status-bar">
                <div className="resto-status-dot" />
                <span>{restaurants.length} restaurant(s) chargé(s)</span>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default Restaurants;