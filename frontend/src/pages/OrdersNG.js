import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STATUS_CONFIG = {
  PENDING:   { label: "En attente",  color: "#6b6456", bg: "rgba(107,100,86,0.12)",  border: "#3a3630", icon: "⏳" },
  PAID:      { label: "Payée",       color: "#6ecfa6", bg: "rgba(46,125,94,0.12)",   border: "#2e7d5e", icon: "💳" },
  PREPARING: { label: "En cuisine",  color: "#e8a44a", bg: "rgba(201,138,76,0.12)",  border: "#7a5a2b", icon: "👨‍🍳" },
  READY:     { label: "Prête",       color: "#a78bfa", bg: "rgba(139,92,246,0.12)",  border: "#6d4fc4", icon: "🍽️" },
  DELIVERED: { label: "Livrée",      color: "#c9a84c", bg: "rgba(201,168,76,0.12)", border: "#7a6030", icon: "✓" },
};

const ACTION_CONFIG = {
  PENDING:   { label: "Payer",        action: "pay",     icon: "💳", accent: "#2e7d5e", accentHover: "#3aaa7a" },
  PAID:      { label: "En cuisine",   action: "prepare", icon: "👨‍🍳", accent: "#c9a84c", accentHover: "#e8c97a" },
  PREPARING: { label: "Marquer prêt", action: "ready",   icon: "🍽️", accent: "#8b5cf6", accentHover: "#a78bfa" },
  READY:     { label: "Livrer",       action: "deliver", icon: "🚚", accent: "#c9a84c", accentHover: "#e8c97a" },
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch {
      showToast("Impossible de charger les commandes.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, action) => {
    setActionLoading(id);
    try {
      const res = await fetch(`http://localhost:8080/orders/${id}/${action}`, {
        method: action === "pay" ? "POST" : "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await fetchOrders();
        showToast("Commande mise à jour.", "success");
      } else {
        showToast("Erreur lors de la mise à jour.");
      }
    } catch {
      showToast("Erreur réseau.");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statuses = ["ALL", ...Object.keys(STATUS_CONFIG)];
  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

        .ord-root {
          font-family: 'DM Sans', sans-serif;
          background: #0e0d0b;
          color: #e8e2d8;
          min-height: 100vh;
        }

        .ord-layout {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* HEADER */
        .ord-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 0 24px;
          border-bottom: 1px solid #2e2b26;
          animation: fadeDown 0.6s ease both;
        }

        .ord-logo { display: flex; align-items: baseline; gap: 10px; }

        .ord-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #f5f0e8;
          letter-spacing: 0.02em;
        }

        .ord-logo-badge {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #c9a84c;
          border: 1px solid #c9a84c;
          padding: 2px 8px;
          border-radius: 2px;
        }

        .ord-btn-back {
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

        .ord-btn-back:hover {
          border-color: #c9a84c;
          color: #c9a84c;
          background: rgba(201,168,76,0.06);
        }

        /* MAIN */
        .ord-main { padding: 40px 0 60px; }

        .ord-welcome {
          animation: fadeUp 0.5s 0.1s ease both;
          margin-bottom: 32px;
        }

        .ord-welcome-label {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 10px;
        }

        .ord-welcome-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 700;
          color: #f5f0e8;
          line-height: 1.15;
        }

        .ord-welcome-title span { color: #c9a84c; }

        /* STATS BAR */
        .ord-stats {
          display: flex;
          gap: 12px;
          margin-bottom: 28px;
          animation: fadeUp 0.5s 0.15s ease both;
          flex-wrap: wrap;
        }

        .ord-stat {
          background: #191714;
          border: 1px solid #2e2b26;
          border-radius: 6px;
          padding: 12px 18px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 110px;
        }

        .ord-stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #f5f0e8;
        }

        .ord-stat-label {
          font-size: 11px;
          color: #6b6456;
          letter-spacing: 0.05em;
        }

        /* FILTER TABS */
        .ord-filters {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          animation: fadeUp 0.5s 0.2s ease both;
          flex-wrap: wrap;
        }

        .ord-filter-btn {
          background: transparent;
          border: 1px solid #2e2b26;
          color: #6b6456;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          padding: 6px 14px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.05em;
        }

        .ord-filter-btn:hover {
          border-color: #c9a84c;
          color: #c9a84c;
        }

        .ord-filter-btn.active {
          background: #c9a84c;
          border-color: #c9a84c;
          color: #0e0d0b;
          font-weight: 500;
        }

        /* ORDER CARDS */
        .ord-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: fadeUp 0.5s 0.25s ease both;
        }

        .ord-card {
          background: #191714;
          border: 1px solid #2e2b26;
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
          animation: fadeIn 0.35s ease both;
        }

        .ord-card:hover {
          border-color: #3a3630;
          box-shadow: 0 4px 24px rgba(0,0,0,0.3);
        }

        .ord-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          border-bottom: 1px solid #2e2b26;
        }

        .ord-card-left { display: flex; align-items: center; gap: 14px; }

        .ord-card-num {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          color: #f5f0e8;
        }

        .ord-card-restaurant {
          font-size: 12px;
          color: #6b6456;
          margin-top: 2px;
        }

        .ord-status-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          padding: 4px 12px;
          border-radius: 20px;
          border: 1px solid;
          letter-spacing: 0.04em;
        }

        /* ORDER BODY */
        .ord-card-body {
          padding: 16px 24px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: start;
        }

        /* ITEMS LIST */
        .ord-items { display: flex; flex-direction: column; gap: 6px; }

        .ord-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
        }

        .ord-item-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #3a3630;
          flex-shrink: 0;
        }

        .ord-item-name { color: #c8c0b4; flex: 1; }

        .ord-item-qty {
          font-size: 11px;
          color: #6b6456;
          background: #211f1b;
          border: 1px solid #2e2b26;
          padding: 1px 8px;
          border-radius: 10px;
        }

        .ord-item-price { font-size: 13px; color: #6b6456; }

        /* TOTAL + ACTION */
        .ord-card-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        .ord-total-label { font-size: 11px; color: #6b6456; text-align: right; }

        .ord-total-value {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          color: #c9a84c;
        }

        .ord-btn-action {
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 10px 18px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .ord-btn-action:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(0,0,0,0.4);
          filter: brightness(1.15);
        }

        .ord-btn-action:disabled { opacity: 0.5; cursor: not-allowed; }

        .ord-delivered-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #c9a84c;
          border: 1px solid rgba(201,168,76,0.3);
          padding: 8px 14px;
          border-radius: 4px;
        }

        /* STATUS BAR */
        .ord-section-footer {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 24px;
          background: #211f1b;
          border-top: 1px solid #2e2b26;
          font-size: 12px;
          color: #6b6456;
          margin-top: 20px;
          border-radius: 6px;
        }

        .ord-status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #2e7d5e;
          box-shadow: 0 0 6px #2e7d5e;
        }

        /* EMPTY */
        .ord-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
          background: #191714;
          border: 1px solid #2e2b26;
          border-radius: 8px;
          color: #6b6456;
          font-size: 14px;
          gap: 10px;
        }

        .ord-empty-icon { font-size: 40px; opacity: 0.4; }

        /* SPINNER */
        @keyframes spin { to { transform: rotate(360deg); } }
        .ord-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        .ord-page-spinner {
          width: 24px; height: 24px;
          border: 2px solid #2e2b26;
          border-top-color: #c9a84c;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* TOAST */
        .ord-toast {
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

        .ord-toast.error  { background: #3b1a1a; border: 1px solid #c0392b; color: #e87070; }
        .ord-toast.success { background: #0f2b1e; border: 1px solid #2e7d5e; color: #6ecfa6; }

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

        @media (max-width: 640px) {
          .ord-card-body { grid-template-columns: 1fr; }
          .ord-card-right { align-items: flex-start; }
          .ord-welcome-title { font-size: 26px; }
          .ord-stats { gap: 8px; }
        }
      `}</style>

      <div className="ord-root">
        <div className="ord-layout">

          {/* Header */}
          <header className="ord-header">
            <div className="ord-logo">
              <span className="ord-logo-text">Commandes</span>
              <span className="ord-logo-badge">Suivi</span>
            </div>
            <button className="ord-btn-back" onClick={() => navigate("/")}>
              ← Accueil
            </button>
          </header>

          <main className="ord-main">

            <div className="ord-welcome">
              <p className="ord-welcome-label">Gestion</p>
              <h1 className="ord-welcome-title">
                Mes <span>commandes</span>
              </h1>
            </div>

            {/* Stats */}
            {!loading && orders.length > 0 && (
              <div className="ord-stats">
                <div className="ord-stat">
                  <span className="ord-stat-value">{orders.length}</span>
                  <span className="ord-stat-label">Total</span>
                </div>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                  const count = orders.filter((o) => o.status === key).length;
                  if (!count) return null;
                  return (
                    <div className="ord-stat" key={key} style={{ borderColor: cfg.border }}>
                      <span className="ord-stat-value" style={{ color: cfg.color }}>{count}</span>
                      <span className="ord-stat-label">{cfg.label}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Filters */}
            {!loading && orders.length > 0 && (
              <div className="ord-filters">
                {statuses.map((s) => (
                  <button
                    key={s}
                    className={`ord-filter-btn ${filter === s ? "active" : ""}`}
                    onClick={() => setFilter(s)}
                  >
                    {s === "ALL" ? "Toutes" : STATUS_CONFIG[s]?.label}
                  </button>
                ))}
              </div>
            )}

            {/* Content */}
            {loading ? (
              <div className="ord-empty">
                <div className="ord-page-spinner" />
                <span>Chargement des commandes…</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="ord-empty">
                <span className="ord-empty-icon">📦</span>
                <span>{filter === "ALL" ? "Aucune commande" : `Aucune commande « ${STATUS_CONFIG[filter]?.label} »`}</span>
              </div>
            ) : (
              <div className="ord-list">
                {filtered.map((order, i) => {
                  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                  const actionCfg = ACTION_CONFIG[order.status];
                  const isActioning = actionLoading === order.id;

                  return (
                    <div
                      className="ord-card"
                      key={order.id}
                      style={{ animationDelay: `${i * 0.06}s` }}
                    >
                      {/* Card Header */}
                      <div className="ord-card-header">
                        <div className="ord-card-left">
                          <div>
                            <div className="ord-card-num">Commande #{order.id}</div>
                            {order.restaurant?.name && (
                              <div className="ord-card-restaurant">
                                🍽️ {order.restaurant.name}
                              </div>
                            )}
                          </div>
                        </div>
                        <span
                          className="ord-status-pill"
                          style={{
                            color: cfg.color,
                            background: cfg.bg,
                            borderColor: cfg.border,
                          }}
                        >
                          <span>{cfg.icon}</span>
                          {cfg.label}
                        </span>
                      </div>

                      {/* Card Body */}
                      <div className="ord-card-body">
                        {/* Items */}
                        <div className="ord-items">
                          {order.items?.length > 0 ? (
                            order.items.map((item) => (
                              <div className="ord-item" key={item.id}>
                                <div className="ord-item-dot" />
                                <span className="ord-item-name">{item.menu?.name ?? "Article"}</span>
                                <span className="ord-item-qty">×{item.quantity}</span>
                                <span className="ord-item-price">{item.price?.toFixed(2)} €</span>
                              </div>
                            ))
                          ) : (
                            <span style={{ fontSize: 13, color: "#4a4540" }}>Aucun article</span>
                          )}
                        </div>

                        {/* Total + Action */}
                        <div className="ord-card-right">
                          <div>
                            <div className="ord-total-label">Total</div>
                            <div className="ord-total-value">{order.totalPrice?.toFixed(2)} €</div>
                          </div>

                          {actionCfg ? (
                            <button
                              className="ord-btn-action"
                              style={{
                                background: actionCfg.accent,
                                color: "#0e0d0b",
                              }}
                              onClick={() => updateStatus(order.id, actionCfg.action)}
                              disabled={isActioning}
                            >
                              {isActioning
                                ? <span className="ord-spinner" style={{ color: "#0e0d0b" }} />
                                : <span>{actionCfg.icon}</span>
                              }
                              <span>{isActioning ? "…" : actionCfg.label}</span>
                            </button>
                          ) : order.status === "DELIVERED" && (
                            <span className="ord-delivered-badge">
                              ✓ Livrée
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && (
              <div className="ord-section-footer">
                <div className="ord-status-dot" />
                <span>{filtered.length} commande(s) affichée(s)</span>
              </div>
            )}
          </main>
        </div>

        {toast && (
          <div className={`ord-toast ${toast.type}`}>
            <span>{toast.type === "error" ? "⚠" : "✓"}</span>
            <span>{toast.msg}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default Orders;