import React, { useState, useEffect } from "react";

export default function ProductForm({ product = null, onSave }) {
  const [form, setForm] = useState({ id: "", name: "", barcode: "", stock: 0, price: 0 });

  useEffect(() => {
    if (product) setForm(product);
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "stock" || name === "price" ? Number(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = form.id || `P-${Date.now()}`;
    onSave({ ...form, id });
    setForm({ id: "", name: "", barcode: "", stock: 0, price: 0 });
    alert("Producto guardado");
  };

  return (
    <div>
      <h2>{product ? "Editar producto" : "Nuevo producto"}</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <label>Nombre:<input name="name" value={form.name} onChange={handleChange} required /></label>
        <label>Código de barras:<input name="barcode" value={form.barcode} onChange={handleChange} /></label>
        <label>Stock:<input name="stock" type="number" value={form.stock} onChange={handleChange} /></label>
        <label>Precio:<input name="price" type="number" value={form.price} onChange={handleChange} /></label>
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}
