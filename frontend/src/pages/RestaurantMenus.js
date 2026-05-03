import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function RestaurantMenus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [ordering, setOrdering] = useState(false);
  const [menus, setMenus] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem("token");

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };
    const addToCart = (menu) => {
      setCart((prev) => {
        const existing = prev.find((m) => m.id === menu.id);

        if (existing) {
          return prev.map((m) =>
            m.id === menu.id
              ? { ...m, quantity: m.quantity + 1 }
              : m
          );
        }

        return [...prev, { ...menu, quantity: 1 }];
      });
    };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((m) => m.id !== id));
  };
const totalPrice = cart.reduce(
  (sum, m) => sum + m.price * m.quantity,
  0
);
const createOrder = async () => {
  if (cart.length === 0) {
    showToast("Panier vide");
    return;
  }

  setOrdering(true);

  try {
    const res = await fetch("http://localhost:8080/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        restaurantId: parseInt(id),

        items: cart.map((item) => ({
          menuId: item.id,
          quantity: item.quantity,
        })),
      }),
    });

    if (res.ok) {
      setCart([]);
      showToast("Commande envoyée ✔", "success");
    } else {
      const err = await res.text();
      console.error(err);
      showToast("Erreur commande");
    }
  } catch (e) {
    console.error(e);
    showToast("Erreur réseau");
  } finally {
    setOrdering(false);
  }
};

  const fetchRestaurant = async () => {
    try {
      const res = await fetch(`http://localhost:8080/restaurants/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRestaurant(data);
    } catch {
      showToast("Impossible de charger le restaurant.");
    }
  };

  const fetchMenus = async () => {
    try {
      const res = await fetch(`http://localhost:8080/restaurants/${id}/menus`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMenus(data);
    } catch {
      showToast("Impossible de charger les menus.");
    }
  };

  const createMenu = async () => {
    if (!name || !price) {
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
          restaurant: { id: parseInt(id) },
        }),
      });
      if (res.ok) {
        fetchMenus();
        setName("");
        setPrice("");
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

  const deleteMenu = async (menuId) => {
    try {
      await fetch(`http://localhost:8080/menus/${menuId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenus((prev) => prev.filter((m) => m.id !== menuId));
      showToast("Menu supprimé.", "success");
    } catch {
      showToast("Erreur lors de la suppression.");
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchRestaurant(), fetchMenus()]);
      setLoading(false);
    };
    init();
  }, [id]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

        .rm-root {
          font-family: 'DM Sans', sans-serif;
          background: #0e0d0b;
          color: #e8e2d8;
          min-height: 100vh;
        }

        .rm-layout {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* HEADER */
        .rm-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 0 24px;
          border-bottom: 1px solid #2e2b26;
          animation: fadeDown 0.6s ease both;
        }

        .rm-logo {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }

        .rm-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #f5f0e8;
          letter-spacing: 0.02em;
        }

        .rm-logo-badge {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #c9a84c;
          border: 1px solid #c9a84c;
          padding: 2px 8px;
          border-radius: 2px;
        }

        .rm-btn-back {
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

        .rm-btn-back:hover {
          border-color: #c9a84c;
          color: #c9a84c;
          background: rgba(201,168,76,0.06);
        }

        /* MAIN */
        .rm-main { padding: 40px 0 60px; }

        /* HERO CARD — restaurant info */
        .rm-hero {
          position: relative;
          background: #191714;
          border: 1px solid #2e2b26;
          border-radius: 8px;
          padding: 32px;
          margin-bottom: 28px;
          overflow: hidden;
          animation: fadeUp 0.5s 0.1s ease both;
        }

        .rm-hero::after {
          content: '🍽️';
          position: absolute;
          right: 32px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 72px;
          opacity: 0.06;
          pointer-events: none;
        }

        .rm-hero-label {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 10px;
        }

        .rm-hero-name {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 4vw, 38px);
          font-weight: 700;
          color: #f5f0e8;
          margin-bottom: 10px;
          line-height: 1.15;
        }

        .rm-hero-name span { color: #c9a84c; }

        .rm-hero-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .rm-hero-address {
          font-size: 13px;
          color: #6b6456;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .rm-hero-desc {
          font-size: 13px;
          color: #4a4540;
          line-height: 1.5;
          margin-top: 4px;
        }

        .rm-hero-skeleton {
          height: 90px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rm-skeleton-line {
          background: linear-gradient(90deg, #211f1b 25%, #2a2724 50%, #211f1b 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }

        @keyframes shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }

        /* SECTION */
        .rm-section {
          background: #191714;
          border: 1px solid #2e2b26;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .rm-section:nth-child(3) { animation: fadeUp 0.5s 0.2s ease both; }
        .rm-section:nth-child(4) { animation: fadeUp 0.5s 0.3s ease both; }

        .rm-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #2e2b26;
        }

        .rm-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          color: #f5f0e8;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .rm-section-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          background: #211f1b;
          border: 1px solid #2e2b26;
          color: #6b6456;
          padding: 2px 10px;
          border-radius: 20px;
        }

        /* FORM */
        .rm-form {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 12px;
          padding: 20px 24px;
        }

        .rm-input {
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

        .rm-input::placeholder { color: #4a4540; }
        .rm-input:focus { border-color: #c9a84c; }

        .rm-btn-add {
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

        .rm-btn-add:hover:not(:disabled) {
          background: #e8c97a;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(201,168,76,0.3);
        }

        .rm-btn-add:disabled { opacity: 0.5; cursor: not-allowed; }

        /* MENU ITEMS */
        .rm-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 24px;
          border-bottom: 1px solid #2e2b26;
          transition: background 0.15s;
          animation: fadeIn 0.3s ease both;
        }

        .rm-item:last-child { border-bottom: none; }
        .rm-item:hover { background: #211f1b; }

        .rm-item-num {
          font-family: 'Playfair Display', serif;
          font-size: 13px;
          color: #3a3630;
          width: 24px;
          text-align: right;
          flex-shrink: 0;
        }

        .rm-item-icon {
          width: 38px;
          height: 38px;
          border-radius: 6px;
          background: linear-gradient(135deg, rgba(201,168,76,0.12), rgba(46,125,94,0.1));
          border: 1px solid #2e2b26;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          flex-shrink: 0;
        }

        .rm-item-name {
          flex: 1;
          font-size: 14px;
          color: #f5f0e8;
          font-weight: 500;
        }

        .rm-item-price {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          color: #c9a84c;
          margin-right: 16px;
        }

        .rm-btn-delete {
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

        .rm-btn-delete:hover {
          border-color: #c0392b;
          color: #e87070;
          background: rgba(192,57,43,0.08);
        }

        /* STATUS BAR */
        .rm-status-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 24px;
          background: #211f1b;
          border-top: 1px solid #2e2b26;
          font-size: 12px;
          color: #6b6456;
        }

        .rm-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2e7d5e;
          box-shadow: 0 0 6px #2e7d5e;
        }

        /* EMPTY */
        .rm-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          color: #6b6456;
          font-size: 14px;
          gap: 10px;
        }

        .rm-empty-icon { font-size: 36px; opacity: 0.4; }

        /* SPINNER */
        @keyframes spin { to { transform: rotate(360deg); } }
        .rm-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: #0e0d0b;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        /* TOAST */
        .rm-toast {
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

        .rm-toast.error {
          background: #3b1a1a;
          border: 1px solid #c0392b;
          color: #e87070;
        }

        .rm-toast.success {
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

        @media (max-width: 640px) {
          .rm-form { grid-template-columns: 1fr; }
          .rm-hero-name { font-size: 24px; }
        }
      `}</style>

      <div className="rm-root">
        <div className="rm-layout">

          {/* Header */}
          <header className="rm-header">
            <div className="rm-logo">
              <span className="rm-logo-text">
                {restaurant ? restaurant.name : "Restaurant"}
              </span>
              <span className="rm-logo-badge">Menus</span>
            </div>
            <button className="rm-btn-back" onClick={() => navigate("/restaurants")}>
              ← Restaurants
            </button>
          </header>

          <main className="rm-main">

            {/* Restaurant Hero */}
            <div className="rm-hero">
              {loading ? (
                <div className="rm-hero-skeleton">
                  <div>
                    <div className="rm-skeleton-line" style={{ width: 80, height: 11, marginBottom: 12 }} />
                    <div className="rm-skeleton-line" style={{ width: 240, height: 32, marginBottom: 10 }} />
                    <div className="rm-skeleton-line" style={{ width: 160, height: 13 }} />
                  </div>
                </div>
              ) : restaurant ? (
                <>
                  <p className="rm-hero-label">Établissement #{id}</p>
                  <h1 className="rm-hero-name">{restaurant.name}</h1>
                  <div className="rm-hero-meta">
                    {restaurant.address && (
                      <span className="rm-hero-address">
                        <span>📍</span> {restaurant.address}
                      </span>
                    )}
                    {restaurant.description && (
                      <p className="rm-hero-desc">{restaurant.description}</p>
                    )}
                  </div>
                </>
              ) : null}
            </div>

            {/* Add Menu */}
            <div className="rm-section">
              <div className="rm-section-header">
                <div className="rm-section-title">Ajouter un menu</div>
              </div>
              <div className="rm-form">
                <input
                  className="rm-input"
                  placeholder="Nom du menu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="rm-input"
                  placeholder="Prix (€)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  min="0"
                  step="0.01"
                />
                <button
                  className="rm-btn-add"
                  onClick={createMenu}
                  disabled={submitting}
                >
                  {submitting ? <span className="rm-spinner" /> : <span>+</span>}
                  <span>{submitting ? "Ajout…" : "Ajouter"}</span>
                </button>
              </div>
            </div>

            {/* Menu List */}
            <div className="rm-section">
              <div className="rm-section-header">
                <div className="rm-section-title">
                  Carte
                  <span className="rm-section-count">
                    {menus.length > 0 ? menus.length : "—"}
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="rm-empty">
                  <span style={{ fontSize: 24, opacity: 0.4 }}>⏳</span>
                  <span>Chargement…</span>
                </div>
              ) : menus.length === 0 ? (
                <div className="rm-empty">
                  <span className="rm-empty-icon">📋</span>
                  <span>Aucun menu pour ce restaurant</span>
                </div>
              ) : (
                menus.map((menu, i) => (
                  <div
                    className="rm-item"
                    key={menu.id}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <span className="rm-item-num">{i + 1}</span>
                    <div className="rm-item-icon">🍴</div>
                    <span className="rm-item-name">{menu.name}</span>
                    <span className="rm-item-price">{menu.price?.toFixed(2)} €</span>
                    <button
                      className="rm-btn-delete"
                      onClick={() => deleteMenu(menu.id)}
                    >
                      ✕ Supprimer
                    </button>
                    <button
                      className="rm-btn-add"
                      onClick={() => addToCart(menu)}
                    >
                      + Ajouter
                    </button>
                  </div>
                ))
              )}
              <div className="rm-section">
                <div className="rm-section-header">
                  <div className="rm-section-title">🛒 Panier</div>
                </div>

                {cart.length === 0 ? (
                  <div className="rm-empty">Panier vide</div>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div className="rm-item" key={item.id}>
                        <span className="rm-item-name">{item.name}</span>
                        <span className="rm-item-price">  {item.price} € × {item.quantity}</span>

                        <button
                          className="rm-btn-delete"
                          onClick={() => removeFromCart(item.id)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <div className="rm-status-bar">
                      <span>Total : {totalPrice.toFixed(2)} €</span>
                    </div>

                    <button
                      className="rm-btn-add"
                      onClick={createOrder}
                      disabled={ordering}
                      style={{ margin: "12px 24px" }}
                    >
                      {ordering ? "Commande..." : "Commander"}
                    </button>
                  </>
                )}
              </div>
              <div className="rm-status-bar">
                <div className="rm-status-dot" />
                <span>{menus.length} plat(s) à la carte</span>
              </div>
            </div>

          </main>
        </div>

        {toast && (
          <div className={`rm-toast ${toast.type}`}>
            <span>{toast.type === "error" ? "⚠" : "✓"}</span>
            <span>{toast.msg}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default RestaurantMenus;