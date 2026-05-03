import { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");
    const statusColor = {
      PENDING: "gray",
      PAID: "blue",
      PREPARING: "orange",
      READY: "purple",
      DELIVERED: "green"
    };
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8080/orders", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Erreur chargement orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const payOrder = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/orders/${id}/pay`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const updateStatus = async (id, action) => {
    try {
      const res = await fetch(
        `http://localhost:8080/orders/${id}/${action}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div style={{ padding: 20 }}>
      <h1>Mes commandes</h1>

      {orders.length === 0 ? (
        <p>Aucune commande</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ccc",
              marginBottom: 10,
              padding: 10
            }}
          >
            <h3>Commande #{order.id}</h3>

            <p>
              Status :
              <span style={{ color: statusColor[order.status] }}>
                {order.status}
              </span>
            </p>
            <p>Total : {order.totalPrice} €</p>

            <p>
              Restaurant :{" "}
              {order.restaurant?.name ?? "Inconnu"}
            </p>

            {/* 🔥 IMPORTANT: items au lieu de menus */}
            <p>Articles :</p>

            <ul>
              {order.items?.map((item) => (
                <li key={item.id}>
                  {item.menu?.name} × {item.quantity} —{" "}
                  {item.price} €
                </li>
              ))}
            </ul>

            {order.status === "PENDING" && (
              <button onClick={() => updateStatus(order.id, "pay")}>
                💳 Payer
              </button>
            )}

            {order.status === "PAID" && (
              <button onClick={() => updateStatus(order.id, "prepare")}>
                👨‍🍳 Préparer
              </button>
            )}

            {order.status === "PREPARING" && (
              <button onClick={() => updateStatus(order.id, "ready")}>
                🍽️ Prêt
              </button>
            )}

            {order.status === "READY" && (
              <button onClick={() => updateStatus(order.id, "deliver")}>
                🚚 Livrer
              </button>
            )}

            {order.status === "DELIVERED" && (
              <span style={{ color: "green" }}>✔ Livrée</span>
            )}

            {order.status === "PAID" && (
              <span style={{ color: "green" }}>
                Payée ✔
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;