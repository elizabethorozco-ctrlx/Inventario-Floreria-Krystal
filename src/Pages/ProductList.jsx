import React from "react";

export default function ProductList({ products = [], onEdit = () => {}, onDelete = () => {} }) {
  return (
    <div>
      <h2>Productos</h2>
      <table className="table">
        <thead><tr><th>ID</th><th>Nombre</th><th>Código</th><th>Stock</th><th>Precio</th><th>Acciones</th></tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.barcode}</td>
              <td>{p.stock}</td>
              <td>{p.price}</td>
              <td>
                <button onClick={() => onEdit(p)}>Editar</button>
                <button onClick={() => onDelete(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {products.length === 0 && <tr><td colSpan="6">No hay productos</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
