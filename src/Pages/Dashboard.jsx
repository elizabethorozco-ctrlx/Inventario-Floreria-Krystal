import React from "react";

export default function Dashboard({ products = [], movements = [] }) {
  const totalProducts = products.length;
  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
  const recent = movements.slice(-5).reverse();

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="stats">
        <div className="card">Productos registrados: <strong>{totalProducts}</strong></div>
        <div className="card">Stock total: <strong>{totalStock}</strong></div>
        <div className="card">Movimientos: <strong>{movements.length}</strong></div>
      </div>

      <section>
        <h3>Últimos movimientos</h3>
        <ul>
          {recent.map(m => (
            <li key={m.id}>{m.date ? new Date(m.date).toLocaleString() : ""} — {m.type} — {m.quantity} — {m.note}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
