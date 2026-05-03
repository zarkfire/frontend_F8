import { useEffect, useState, useCallback } from "react";

function Menus() {
  const [menus, setMenus] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem("token");

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/menus", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMenus(data);
    } catch {
      setError("Impossible de charger les menus.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createMenu = async () => {
    if (!name || !price || !restaurantId) {
      showToast("Veuillez remplir tous les champs.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:8080/menus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          restaurant: { id: parseInt(restaurantId) },
        }),
      });
      if (res.ok) {
        fetchMenus();
        setName("");
        setPrice("");
        setRestaurantId("");
        showToast("Menu ajouté avec succès.", "success");
      } else {
        showToast("Erreur lors de la création.");
      }
    } catch {
      showToast("Erreur réseau.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMenu = async (id) => {
    try {
      await fetch(`http://localhost:8080/menus/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenus((prev) => prev.filter((m) => m.id !== id));
      showToast("Menu supprimé.", "success");
    } catch {
      showToast("Erreur lors de la suppression.");
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

        .menus-root {
          font-family: 'DM Sans', sans-serif;
          background: #0e0d0b;
          color: #e8e2d8;
          min-height: 100vh;
        }

        .menus-layout {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* HEADER */
        .menus-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 0 24px;
          border-bottom: 1px solid #2e2b26;
          animation: fadeDown 0.6s ease both;
        }

        .menus-logo {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }

        .menus-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #f5f0e8;
          letter-spacing: 0.02em;
        }

        .menus-logo-badge {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #c9a84c;
          border: 1px solid #c9a84c;
          padding: 2px 8px;
          border-radius: 2px;
        }

        .menus-main {
          padding: 40px 0 60px;
        }

        .menus-welcome {
          animation: fadeUp 0.5s 0.1s ease both;
          margin-bottom: 40px;
        }

        .menus-welcome-label {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 10px;
        }

        .menus-welcome-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 700;
          color: #f5f0e8;
          line-height: 1.15;
        }

        .menus-welcome-title span { color: #c9a84c; }

        /* FORM SECTION */
        .menus-section {
          background: #191714;
          border: 1px solid #2e2b26;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 24px;
          animation: fadeUp 0.5s 0.2s ease both;
        }

        .menus-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #2e2b26;
        }

        .menus-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          color: #f5f0e8;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .menus-section-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          background: #211f1b;
          border: 1px solid #2e2b26;
          color: #6b6456;
          padding: 2px 10px;
          border-radius: 20px;
        }

        /* FORM */
        .menus-form {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr auto;
          gap: 12px;
          padding: 20px 24px;
          border-bottom: 1px solid #2e2b26;
        }

        .menus-input {
          background: #211f1b;
          border: 1px solid #2e2b26;
          color: #e8e2d8;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          padding: 10px 14px;
          border-radius: 4px;
          outline: none;
          transition: border-color 0.2s;
        }

        .menus-input::placeholder { color: #4a4540; }

        .menus-input:focus {
          border-color: #c9a84c;
        }

        .menus-btn-add {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #c9a84c;
          color: #0e0d0b;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .menus-btn-add:hover:not(:disabled) {
          background: #e8c97a;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(201,168,76,0.3);
        }

        .menus-btn-add:disabled { opacity: 0.5; cursor: not-allowed; }

        /* MENU ITEMS */
        .menus-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 24px;
          border-bottom: 1px solid #2e2b26;
          transition: background 0.15s;
          animation: fadeIn 0.3s ease both;
        }

        .menus-item:last-child { border-bottom: none; }
        .menus-item:hover { background: #211f1b; }

        .menus-item-icon {
          width: 38px;
          height: 38px;
          border-radius: 6px;
          background: linear-gradient(135deg, rgba(201,168,76,0.15), rgba(46,125,94,0.15));
          border: 1px solid #2e2b26;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .menus-item-info { flex: 1; }

        .menus-item-name {
          font-size: 14px;
          color: #f5f0e8;
          font-weight: 500;
        }

        .menus-item-meta {
          font-size: 12px;
          color: #6b6456;
          margin-top: 2px;
        }

        .menus-item-price {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          color: #c9a84c;
          margin-right: 16px;
        }

        .menus-btn-delete {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid #2e2b26;
          color: #6b6456;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .menus-btn-delete:hover {
          border-color: #c0392b;
          color: #e87070;
          background: rgba(192,57,43,0.08);
        }

        /* STATUS BAR */
        .menus-status-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 24px;
          background: #211f1b;
          border-top: 1px solid #2e2b26;
          font-size: 12px;
          color: #6b6456;
        }

        .menus-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2e7d5e;
          box-shadow: 0 0 6px #2e7d5e;
        }

        /* EMPTY */
        .menus-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          color: #6b6456;
          font-size: 14px;
          gap: 10px;
        }

        .menus-empty-icon { font-size: 36px; opacity: 0.4; }

        /* SPINNER */
        @keyframes spin { to { transform: rotate(360deg); } }
        .menus-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: #0e0d0b;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        /* TOAST */
        .menus-toast {
          position: fixed;
          bottom: 28px; right: 28px;
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

        .menus-toast.error {
          background: #3b1a1a;
          border: 1px solid #c0392b;
          color: #e87070;
        }

        .menus-toast.success {
          background: #0f2b1e;
          border: 1px solid #2e7d5e;
          color: #6ecfa6;
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

        @media (max-width: 700px) {
          .menus-form { grid-template-columns: 1fr; }
          .menus-welcome-title { font-size: 26px; }
        }
      `}</style>

      <div className="menus-root">
        <div className="menus-layout">
          {/* Header */}
          <header className="menus-header">
            <div className="menus-logo">
              <span className="menus-logo-text">Menus</span>
              <span className="menus-logo-badge">Gestion</span>
            </div>
          </header>

          <main className="menus-main">
            <div className="menus-welcome">
              <p className="menus-welcome-label">Catalogue</p>
              <h1 className="menus-welcome-title">
                Gestion des <span>menus</span>
              </h1>
            </div>

            <div className="menus-section">
              {/* Section Header */}
              <div className="menus-section-header">
                <div className="menus-section-title">
                  Ajouter un menu
                </div>
              </div>

              {/* Form */}
              <div className="menus-form">
                <input
                  className="menus-input"
                  placeholder="Nom du menu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="menus-input"
                  placeholder="Prix (€)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  min="0"
                  step="0.01"
                />
                <input
                  className="menus-input"
                  placeholder="ID Restaurant"
                  value={restaurantId}
                  onChange={(e) => setRestaurantId(e.target.value)}
                  type="number"
                />
                <button
                  className="menus-btn-add"
                  onClick={createMenu}
                  disabled={submitting}
                >
                  {submitting ? <span className="menus-spinner" /> : <span>+</span>}
                  <span>{submitting ? "Ajout…" : "Ajouter"}</span>
                </button>
              </div>

              {/* List */}
              <div className="menus-section-header" style={{ borderTop: "1px solid #2e2b26", borderBottom: "none" }}>
                <div className="menus-section-title">
                  Liste des menus
                  <span className="menus-section-count">
                    {menus.length > 0 ? menus.length : "—"}
                  </span>
                </div>
              </div>

              <div>
                {loading ? (
                  <div className="menus-empty">
                    <span style={{ fontSize: 24, opacity: 0.5 }}>⏳</span>
                    <span>Chargement…</span>
                  </div>
                ) : error ? (
                  <div className="menus-empty" style={{ color: "#e87070" }}>
                    <span className="menus-empty-icon">⚠</span>
                    <span>{error}</span>
                  </div>
                ) : menus.length === 0 ? (
                  <div className="menus-empty">
                    <span className="menus-empty-icon">📋</span>
                    <span>Aucun menu disponible</span>
                  </div>
                ) : (
                  menus.map((menu, i) => (
                    <div
                      className="menus-item"
                      key={menu.id}
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <div className="menus-item-icon">🍽️</div>
                      <div className="menus-item-info">
                        <div className="menus-item-name">{menu.name}</div>
                        {menu.restaurant && (
                          <div className="menus-item-meta">
                            Restaurant #{menu.restaurant.id}
                          </div>
                        )}
                      </div>
                      <span className="menus-item-price">{menu.price?.toFixed(2)} €</span>
                      <button
                        className="menus-btn-delete"
                        onClick={() => deleteMenu(menu.id)}
                      >
                        ✕ Supprimer
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="menus-status-bar">
                <div className="menus-status-dot" />
                <span>{menus.length} menu(s) chargé(s)</span>
              </div>
            </div>
          </main>
        </div>

        {toast && (
          <div className={`menus-toast ${toast.type}`}>
            <span>{toast.type === "error" ? "⚠" : "✓"}</span>
            <span>{toast.msg}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default Menus;