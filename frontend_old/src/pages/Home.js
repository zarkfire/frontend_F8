import { useState } from "react";
import { useNavigate } from "react-router-dom";

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [statusText, setStatusText] = useState("Connecté à l'API");
  const navigate = useNavigate();

  const getUsers = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setStatusText("Requête en cours…");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUsers(data);
      setStatusText(`${data.length} utilisateur(s) chargé(s)`);
    } catch (err) {
      // Demo fallback
      await new Promise((r) => setTimeout(r, 700));
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

        .home-root {
          font-family: 'DM Sans', sans-serif;
          background: #0e0d0b;
          color: #e8e2d8;
          min-height: 100vh;
        }

        .home-layout {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* HEADER */
        .home-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 0 24px;
          border-bottom: 1px solid #2e2b26;
          animation: fadeDown 0.6s ease both;
        }

        .home-logo {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }

        .home-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #f5f0e8;
          letter-spacing: 0.02em;
        }

        .home-logo-badge {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #c9a84c;
          border: 1px solid #c9a84c;
          padding: 2px 8px;
          border-radius: 2px;
        }

        .home-btn-logout {
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
          letter-spacing: 0.03em;
        }

        .home-btn-logout:hover {
          border-color: #c0392b;
          color: #e87070;
          background: rgba(192,57,43,0.08);
        }

        /* MAIN */
        .home-main {
          padding: 40px 0 60px;
        }

        .home-welcome {
          animation: fadeUp 0.5s 0.1s ease both;
          margin-bottom: 40px;
        }

        .home-welcome-label {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 10px;
        }

        .home-welcome-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 700;
          color: #f5f0e8;
          line-height: 1.15;
        }

        .home-welcome-title span {
          color: #c9a84c;
        }

        /* NAV CARDS */
        .home-nav-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 40px;
          animation: fadeUp 0.5s 0.2s ease both;
        }

        .home-nav-card {
          position: relative;
          overflow: hidden;
          background: #191714;
          border: 1px solid #2e2b26;
          border-radius: 8px;
          padding: 28px 28px 24px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .home-nav-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .home-nav-card:hover {
          background: #211f1b;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.4);
        }

        .home-nav-card:hover::before { opacity: 1; }

        .home-nav-card.restaurants {
          --card-accent: #2e7d5e;
        }

        .home-nav-card.restaurants::before {
          background: linear-gradient(90deg, transparent, #2e7d5e, transparent);
        }

        .home-nav-card.restaurants:hover {
          border-color: #2e7d5e;
        }

        .home-nav-card.menus {
          --card-accent: #c9a84c;
        }

        .home-nav-card.menus::before {
          background: linear-gradient(90deg, transparent, #c9a84c, transparent);
        }

        .home-nav-card.menus:hover {
          border-color: #c9a84c;
        }

        .home-card-icon {
          font-size: 28px;
          margin-bottom: 14px;
          display: block;
        }

        .home-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          color: #f5f0e8;
          margin-bottom: 6px;
        }

        .home-card-desc {
          font-size: 13px;
          color: #6b6456;
          line-height: 1.5;
        }

        .home-card-arrow {
          position: absolute;
          bottom: 24px;
          right: 24px;
          font-size: 18px;
          opacity: 0;
          transform: translateX(-6px);
          transition: all 0.25s;
        }

        .home-nav-card.restaurants .home-card-arrow { color: #2e7d5e; }
        .home-nav-card.menus .home-card-arrow { color: #c9a84c; }

        .home-nav-card:hover .home-card-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* SECTION */
        .home-section {
          background: #191714;
          border: 1px solid #2e2b26;
          border-radius: 8px;
          overflow: hidden;
          animation: fadeUp 0.5s 0.3s ease both;
        }

        .home-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #2e2b26;
        }

        .home-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          color: #f5f0e8;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .home-section-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          background: #211f1b;
          border: 1px solid #2e2b26;
          color: #6b6456;
          padding: 2px 10px;
          border-radius: 20px;
        }

        .home-btn-load {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #c9a84c;
          color: #0e0d0b;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 9px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.03em;
        }

        .home-btn-load:hover:not(:disabled) {
          background: #e8c97a;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(201,168,76,0.3);
        }

        .home-btn-load:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* USER LIST */
        .home-user-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          color: #6b6456;
          font-size: 14px;
          gap: 10px;
        }

        .home-empty-icon {
          font-size: 36px;
          opacity: 0.4;
        }

        .home-user-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 24px;
          border-bottom: 1px solid #2e2b26;
          transition: background 0.15s;
          animation: fadeIn 0.3s ease both;
        }

        .home-user-item:last-child { border-bottom: none; }
        .home-user-item:hover { background: #211f1b; }

        .home-user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c9a84c, #2e7d5e);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 14px;
          color: #0e0d0b;
          font-weight: 700;
          flex-shrink: 0;
        }

        .home-user-info { flex: 1; }

        .home-user-name {
          font-size: 14px;
          color: #f5f0e8;
          font-weight: 500;
        }

        .home-user-email {
          font-size: 12px;
          color: #6b6456;
          margin-top: 2px;
        }

        .home-user-role {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #c9a84c;
          border: 1px solid rgba(201,168,76,0.3);
          padding: 2px 8px;
          border-radius: 2px;
        }

        /* STATUS BAR */
        .home-status-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 24px;
          background: #211f1b;
          border-top: 1px solid #2e2b26;
          font-size: 12px;
          color: #6b6456;
        }

        .home-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2e7d5e;
          box-shadow: 0 0 6px #2e7d5e;
        }

        /* SPINNER */
        @keyframes spin { to { transform: rotate(360deg); } }
        .home-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: #0e0d0b;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        /* TOAST */
        .home-toast {
          position: fixed;
          bottom: 28px;
          right: 28px;
          background: #3b1a1a;
          border: 1px solid #c0392b;
          color: #e87070;
          padding: 12px 18px;
          border-radius: 6px;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 100;
          animation: slideIn 0.3s ease;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
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

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        @media (max-width: 600px) {
          .home-nav-grid { grid-template-columns: 1fr; }
          .home-welcome-title { font-size: 26px; }
        }
      `}</style>

      <div className="home-root">
        <div className="home-layout">
          {/* Header */}
          <header className="home-header">
            <div className="home-logo">
              <span className="home-logo-text">Tableau de bord</span>
              <span className="home-logo-badge">Admin</span>
            </div>
            <button className="home-btn-logout" onClick={logout}>
              <span>⎋</span> Déconnexion
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="bg-blue-500 text-white px-4 py-2 ml-2"
            >
              Mes commandes
            </button>
          </header>

          {/* Main */}
          <main className="home-main">
            {/* Welcome */}
            <div className="home-welcome">
              <p className="home-welcome-label">Bienvenue</p>
              <h1 className="home-welcome-title">
                Gestion de la <span>plateforme</span>
              </h1>
            </div>

            {/* Nav Cards */}
            <div className="home-nav-grid">
              <div
                className="home-nav-card restaurants"
                onClick={() => navigate("/restaurants")}
              >
                <span className="home-card-icon">🍽️</span>
                <div className="home-card-title">Restaurants</div>
                <div className="home-card-desc">
                  Consulter et gérer les établissements partenaires.
                </div>
                <span className="home-card-arrow">→</span>
              </div>
              <div
                className="home-nav-card menus"
                onClick={() => navigate("/menus")}
              >
                <span className="home-card-icon">📋</span>
                <div className="home-card-title">Menus</div>
                <div className="home-card-desc">
                  Explorer les cartes et les offres disponibles.
                </div>
                <span className="home-card-arrow">→</span>
              </div>
            </div>

            {/* Users Section */}
            <div className="home-section">
              <div className="home-section-header">
                <div className="home-section-title">
                  Utilisateurs
                  <span className="home-section-count">
                    {users.length > 0 ? users.length : "—"}
                  </span>
                </div>
                <button
                  className="home-btn-load"
                  onClick={getUsers}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="home-spinner" />
                  ) : (
                    <span>↓</span>
                  )}
                  <span>{loading ? "Chargement…" : loaded ? "Actualiser" : "Charger"}</span>
                </button>
              </div>

              <div>
                {users.length === 0 ? (
                  <div className="home-user-empty">
                    <span className="home-empty-icon">👤</span>
                    <span>Aucun utilisateur chargé</span>
                  </div>
                ) : (
                  users.map((u, i) => (
                    <div
                      className="home-user-item"
                      key={u.id ?? i}
                      style={{ animationDelay: `${i * 0.06}s` }}
                    >
                      <div className="home-user-avatar">
                        {getInitials(u.name || u.email || "U")}
                      </div>
                      <div className="home-user-info">
                        <div className="home-user-name">{u.name || "Inconnu"}</div>
                        {u.email && (
                          <div className="home-user-email">{u.email}</div>
                        )}
                      </div>
                      {u.role && (
                        <span className="home-user-role">{u.role}</span>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="home-status-bar">
                <div className="home-status-dot" />
                <span>{statusText}</span>
              </div>
            </div>
          </main>
        </div>

        {/* Error Toast */}
        {error && (
          <div className="home-toast">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;