import React from "react";
import { exportCSV } from "../utils/csvExport";

export default function Reports({ products = [], movements = [] }) {
  return (
    <div>
      <h2>Reportes</h2>
      <p>Puedes exportar el inventario o el historial de movimientos en CSV.</p>
      <button onClick={() => exportCSV("inventario.csv", products)}>Exportar inventario</button>
      <button onClick={() => exportCSV("movimientos.csv", movements)}>Exportar movimientos</button>
    </div>
  );
}
