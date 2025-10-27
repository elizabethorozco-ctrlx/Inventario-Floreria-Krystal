# Inventario-Floreria-Krystal
Sistema de inventario para el control y manejo de productos de la Floreria Krystal
import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import InventoryMovements from "./components/InventoryMovements";
import Reports from "./components/Reports";
import Backlog from "./components/Backlog";
import SprintCalendar from "./components/SprintCalendar";
import initialData from "./data/initialData";

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("dashboard");
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("fk-data");
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem("fk-data", JSON.stringify(data));
  }, [data]);

  const addOrUpdateProduct = (product) => {
    setData(prev => {
      const exists = prev.products.find(p => p.id === product.id);
      if (exists) {
        return { ...prev, products: prev.products.map(p => p.id === product.id ? product : p) };
      }
      return { ...prev, products: [...prev.products, product] };
    });
  };

  const deleteProduct = (id) => {
    setData(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
  };

  const addMovement = (movement) => {
    setData(prev => {
      // update stock
      const products = prev.products.map(p => {
        if (p.id === movement.productId) {
          const newStock = p.stock + (movement.type === "IN" ? movement.quantity : -movement.quantity);
          return { ...p, stock: Math.max(0, newStock) };
        }
        return p;
      });
      return { ...prev, products, movements: [...prev.movements, movement] };
    });
  };

  if (!user) {
    return <Login onLogin={(u) => setUser(u)} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Florería Krystal — Sistema de Inventarios</h1>
        <div className="nav">
          <button onClick={() => setView("dashboard")}>Dashboard</button>
          <button onClick={() => setView("products")}>Productos</button>
          <button onClick={() => setView("new-product")}>Nuevo Producto</button>
          <button onClick={() => setView("movements")}>Movimientos</button>
          <button onClick={() => setView("reports")}>Reportes</button>
          <button onClick={() => setView("backlog")}>Backlog</button>
          <button onClick={() => setView("sprints")}>Calendario Sprints</button>
          <button onClick={() => { setUser(null); localStorage.removeItem("fk-user"); }}>Cerrar sesión</button>
        </div>
      </header>

      <main className="app-main">
        {view === "dashboard" && <Dashboard products={data.products} movements={data.movements} />}
        {view === "products" && <ProductList products={data.products} onEdit={(p) => { setView("edit"); setEditing(p); }} onDelete={deleteProduct} />}
        {view === "new-product" && <ProductForm onSave={addOrUpdateProduct} />}
        {view === "edit" && <ProductForm product={editing} onSave={addOrUpdateProduct} />}
        {view === "movements" && <InventoryMovements products={data.products} onAddMovement={addMovement} movements={data.movements} />}
        {view === "reports" && <Reports products={data.products} movements={data.movements} />}
        {view === "backlog" && <Backlog backlog={data.backlog} />}
        {view === "sprints" && <SprintCalendar sprints={data.sprints} />}
      </main>
    </div>
  );
}

export default App;
