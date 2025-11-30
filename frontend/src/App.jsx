import React, { useState, useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";
import ExcelJS from 'exceljs';

// --------------------- ESTILOS GLOBALES ---------------------
const COLORS = {
  bg: "#FFF8E1",
  primary: "#FFA726", // naranja
  secondary: "#FFB300", // amarillo
  textDark: "#4A3428",
};

const appStyles = {
  fontFamily: "'Lucida Console', 'Courier New', monospace",
  backgroundColor: COLORS.bg,
  minHeight: "100vh",
};

const headerBar = {
  background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
  padding: "12px 20px",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const brandText = {
  fontSize: "1.1rem",
  fontWeight: "bold",
};

const navLinks = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
};

const linkButton = {
  textDecoration: "none",
  color: COLORS.textDark,
  backgroundColor: "rgba(255,255,255,0.9)",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "0.85rem",
};

const mainContainer = {
  padding: "20px",
  maxWidth: "1100px",
  margin: "0 auto",
};

const card = {
  backgroundColor: "white",
  borderRadius: "14px",
  padding: "18px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  marginBottom: "20px",
};

const button = {
  backgroundColor: COLORS.secondary,
  border: "none",
  borderRadius: "999px",
  padding: "8px 16px",
  fontWeight: "bold",
  cursor: "pointer",
  marginRight: "8px",
  marginTop: "6px",
};

const buttonDanger = {
  ...button,
  backgroundColor: "#EF5350",
  color: "white",
};

const input = {
  padding: "6px 10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginRight: "8px",
  marginBottom: "8px",
};

const selectStyle = {
  ...input,
};

// --------------------- DATOS DE PRUEBA ----------------------
const USERS = [
  { username: "admin", password: "1234", role: "admin" },
  { username: "empleado", password: "1234", role: "empleado" },
];

// Productos iniciales de ejemplo (puedes vaciar este arreglo si luego cargas todo desde Excel)
const INITIAL_PRODUCTS = [
  {
    id: 1,
    nombre: "OASIS PIEZA CHICA",
    categoria: "A1",
    precio: 0,
    stock: 10,
    codigoBarras: "LCH",
    localidad: "ALMACÉN A",
  },
  {
    id: 2,
    nombre: "OASIS PIEZA MEDIANA",
    categoria: "A1",
    precio: 0,
    stock: 5,
    codigoBarras: "LCM",
    localidad: "ALMACÉN A",
  },
];

// --------------------- AUXILIAR: RUTA PRIVADA ---------------------
function PrivateRoute({ isAuth, children }) {
  return isAuth ? children : <Navigate to="/login" replace />;
}

// --------------------- LOGIN ---------------------
function LoginPage({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = USERS.find(
      (u) => u.username === user && u.password === pass
    );
    if (!found) {
      setError("Usuario o contraseña incorrectos");
      return;
    }
    onLogin({ username: found.username, role: found.role });
    navigate("/");
  };

  return (
    <div style={{ ...mainContainer, maxWidth: "420px" }}>
      <div style={card}>
        <h2 style={{ color: COLORS.textDark, marginBottom: "10px" }}>
          Florería Krystal · Inventario
        </h2>
        <p style={{ fontSize: "0.9rem", color: "#666" }}>
          Inicia sesión para gestionar el sistema de inventarios.
        </p>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Usuario</label>
            <br />
            <input
              style={{ ...input, width: "100%" }}
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="admin o empleado"
            />
          </div>
          <div>
            <label>Contraseña</label>
            <br />
            <input
              style={{ ...input, width: "100%" }}
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="1234"
            />
          </div>
          {error && (
            <p style={{ color: "red", fontSize: "0.8rem" }}>{error}</p>
          )}
          <button type="submit" style={{ ...button, width: "100%" }}>
            Ingresar
          </button>
        </form>
        <p style={{ marginTop: "10px", fontSize: "0.8rem", color: "#777" }}>
          Usuarios de prueba: <b>admin / 1234</b> y <b>empleado / 1234</b>
        </p>
      </div>
    </div>
  );
}

// --------------------- DASHBOARD ---------------------
function Dashboard({ products, salidas, user }) {
  const totalProductos = products.length;
  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalSalidas = salidas.reduce((acc, s) => acc + (s.cantidad || 0), 0);

  return (
    <div style={mainContainer}>
      <div style={card}>
        <h2>Dashboard</h2>
        <p style={{ color: "#555", fontSize: "0.9rem" }}>
          Resumen general del sistema de inventarios de{" "}
          <b>Florería Krystal</b>.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              ...card,
              marginBottom: 0,
              backgroundColor: "#FFF3E0",
            }}
          >
            <h4>Total de productos</h4>
            <p style={{ fontSize: "1.8rem", margin: 0 }}>{totalProductos}</p>
          </div>
          <div
            style={{
              ...card,
              marginBottom: 0,
              backgroundColor: "#FFF8E1",
            }}
          >
            <h4>Stock actual</h4>
            <p style={{ fontSize: "1.8rem", margin: 0 }}>{totalStock}</p>
          </div>
          <div
            style={{
              ...card,
              marginBottom: 0,
              backgroundColor: "#FBE9E7",
            }}
          >
            <h4>Salidas registradas</h4>
            <p style={{ fontSize: "1.8rem", margin: 0 }}>{totalSalidas}</p>
          </div>
        </div>
      </div>

      <div style={card}>
        <h3>Accesos rápidos</h3>
        <Link to="/productos" style={linkButton}>
          Alta / edición de productos
        </Link>
        <Link to="/salidas" style={linkButton}>
          Registro de salidas
        </Link>
        <Link to="/reportes" style={linkButton}>
          Reportes de stock y salidas
        </Link>
        {user?.role === "admin" && (
          <span style={{ marginLeft: "8px", fontSize: "0.85rem" }}>
            (Rol: <b>admin</b> con permisos completos)
          </span>
        )}
      </div>
    </div>
  );
}

// --------------------- GESTIÓN DE PRODUCTOS + IMPORTAR EXCEL ---------------------
function ProductosPage({ products, setProducts, user }) {
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    categoria: "",
    precio: 0,
    stock: 0,
    codigoBarras: "",
    localidad: "",
  });

  const [archivoExcel, setArchivoExcel] = useState(null);

  const isEditing = form.id !== null;

  const resetForm = () =>
    setForm({
      id: null,
      nombre: "",
      categoria: "",
      precio: 0,
      stock: 0,
      codigoBarras: "",
      localidad: "",
    });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        field === "precio" || field === "stock"
          ? Number(value || 0)
          : value.toUpperCase
          ? value.toUpperCase()
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre) return;

    if (isEditing) {
      setProducts((prev) =>
        prev.map((p) => (p.id === form.id ? { ...form } : p))
      );
    } else {
      const newId =
        products.length > 0
          ? Math.max(...products.map((p) => p.id)) + 1
          : 1;
      setProducts((prev) => [...prev, { ...form, id: newId }]);
    }

    resetForm();
  };

  const handleEdit = (p) => {
    setForm(p);
  };

  const handleDelete = (id) => {
    if (user?.role !== "admin") {
      alert("Solo un usuario administrador puede eliminar productos.");
      return;
    }
    if (window.confirm("¿Eliminar este producto?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // --------- IMPORTAR DESDE EXCEL (PASO 3) ----------
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setArchivoExcel(file || null);
  };

  const handleImportar = async () => {
    if (!archivoExcel) {
      alert("Selecciona primero un archivo Excel.");
      return;
    }

    const buffer = await archivoExcel.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(Buffer.from(buffer));

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      alert("El archivo no contiene hojas válidas.");
      return;
    }

    // Read header row (first row) to map columns
    const headerRow = worksheet.getRow(1);
    const headers = headerRow.values // values[0] is null, values[1] is first cell
      .slice(1)
      .map((h) => String(h || '').trim());

    const rows = [];
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // skip header
      const values = row.values.slice(1);
      const obj = {};
      values.forEach((val, idx) => {
        const key = headers[idx] || `col${idx + 1}`;
        obj[key] = val;
      });
      rows.push(obj);
    });

    // Map sheet rows to your product shape (adjust header names you expect)
    const nuevos = rows.map((row, index) => {
      const baseId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      return {
        id: baseId + index,
        nombre: row.Nombre || row.PRODUCTO || row['NOMBRE DEL PRODUCTO'] || '',
        categoria: row.Categoria || row.CATEGORIA || '',
        precio: Number(row.Precio || row.PRECIO || 0),
        stock: Number(row.Stock || row.EXISTENCIAS || row.CANTIDAD || 0),
        codigoBarras: row.CODIGO_BARRAS || row['CÓDIGO BARRAS'] || row.Codigo || '',
        localidad: row.Localidad || row.LOCALIDAD || '',
      };
    });

    setProducts((prev) => [...prev, ...nuevos]);
    alert(`Se importaron ${nuevos.length} productos desde el Excel.`);
    setArchivoExcel(null);
  };

  return (
    <div style={mainContainer}>
      {/* FORMULARIO CRUD */}
      <div style={card}>
        <h2>Gestión de productos</h2>
        <p style={{ fontSize: "0.9rem", color: "#666" }}>
          Alta, edición y eliminación de productos de inventario.
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <input
              style={{ ...input, flex: "1 1 200px" }}
              placeholder="Nombre del producto"
              value={form.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
            />
            <input
              style={{ ...input, flex: "1 1 120px" }}
              placeholder="Categoría"
              value={form.categoria}
              onChange={(e) => handleChange("categoria", e.target.value)}
            />
            <input
              style={{ ...input, flex: "1 1 120px" }}
              type="number"
              placeholder="Precio"
              value={form.precio}
              onChange={(e) => handleChange("precio", e.target.value)}
            />
            <input
              style={{ ...input, flex: "1 1 120px" }}
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => handleChange("stock", e.target.value)}
            />
            <input
              style={{ ...input, flex: "1 1 160px" }}
              placeholder="Código de barras"
              value={form.codigoBarras}
              onChange={(e) =>
                handleChange("codigoBarras", e.target.value)
              }
            />
            <input
              style={{ ...input, flex: "1 1 160px" }}
              placeholder="Localidad"
              value={form.localidad}
              onChange={(e) => handleChange("localidad", e.target.value)}
            />
          </div>
          <button type="submit" style={button}>
            {isEditing ? "Actualizar producto" : "Agregar producto"}
          </button>
          {isEditing && (
            <button
              type="button"
              style={{ ...button, backgroundColor: "#BDBDBD" }}
              onClick={resetForm}
            >
              Cancelar edición
            </button>
          )}
        </form>
      </div>

      {/* IMPORTAR EXCEL */}
      <div style={card}>
        <h3>Importar productos desde Excel</h3>
        <p style={{ fontSize: "0.9rem", color: "#666" }}>
          Sube el archivo de inventario (por ejemplo, el de Florería
          Krystal) para cargar productos automáticamente.
        </p>
        <input
          type="file"
          accept=".xlsx,.xls"
          style={input}
          onChange={handleFileChange}
        />
        <button type="button" style={button} onClick={handleImportar}>
          Importar productos
        </button>
      </div>

      {/* TABLA DE INVENTARIO */}
      <div style={card}>
        <h3>Inventario actual</h3>
        {products.length === 0 ? (
          <p>No hay productos registrados.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.85rem",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#FFF3E0" }}>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Cód. barras</th>
                <th>Localidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>${p.precio}</td>
                  <td>{p.stock}</td>
                  <td>{p.codigoBarras}</td>
                  <td>{p.localidad}</td>
                  <td>
                    <button
                      style={button}
                      type="button"
                      onClick={() => handleEdit(p)}
                    >
                      Editar
                    </button>
                    <button
                      style={buttonDanger}
                      type="button"
                      onClick={() => handleDelete(p.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// --------------------- SALIDAS ---------------------
function SalidasPage({ products, setProducts, salidas, setSalidas }) {
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState(0);

  const handleSalida = (e) => {
    e.preventDefault();
    const id = Number(productoId);
    const cant = Number(cantidad);
    if (!id || cant <= 0) return;

    const producto = products.find((p) => p.id === id);
    if (!producto) {
      alert("Producto no encontrado");
      return;
    }
    if (producto.stock < cant) {
      alert("No hay suficiente stock para esa salida");
      return;
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: p.stock - cant } : p
      )
    );

    const nuevaSalida = {
      id: salidas.length > 0 ? salidas[salidas.length - 1].id + 1 : 1,
      productoId: id,
      nombreProducto: producto.nombre,
      cantidad: cant,
      fecha: new Date().toISOString(),
    };
    setSalidas((prev) => [...prev, nuevaSalida]);
    setCantidad(0);
    setProductoId("");
  };

  return (
    <div style={mainContainer}>
      <div style={card}>
        <h2>Registro de salidas</h2>
        <p style={{ fontSize: "0.9rem", color: "#666" }}>
          Cada salida descuenta stock del inventario.
        </p>
        <form onSubmit={handleSalida}>
          <select
            style={selectStyle}
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
          >
            <option value="">Selecciona un producto</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} (stock: {p.stock})
              </option>
            ))}
          </select>
          <input
            style={input}
            type="number"
            min="1"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
          <button type="submit" style={button}>
            Registrar salida
          </button>
        </form>
      </div>

      <div style={card}>
        <h3>Historial de salidas</h3>
        {salidas.length === 0 ? (
          <p>No hay salidas registradas.</p>
        ) : (
          <ul style={{ fontSize: "0.9rem" }}>
            {salidas.map((s) => (
              <li key={s.id}>
                [{new Date(s.fecha).toLocaleString()}] {s.nombreProducto} —{" "}
                {s.cantidad} pz.
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// --------------------- REPORTES ---------------------
function ReportesPage({ products, salidas }) {
  const descargarCSV = (tipo) => {
    let csv = "";
    if (tipo === "stock") {
      csv += "id,nombre,categoria,precio,stock,codigoBarras,localidad\n";
      products.forEach((p) => {
        csv += `${p.id},"${p.nombre}",${p.categoria},${p.precio},${p.stock},${p.codigoBarras || ""
          },${p.localidad || ""}\n`;
      });
    } else {
      csv += "id,productoId,nombreProducto,cantidad,fecha\n";
      salidas.forEach((s) => {
        csv += `${s.id},${s.productoId},"${s.nombreProducto}",${s.cantidad},${s.fecha}\n`;
      });
    }

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const nombreArchivo =
      tipo === "stock" ? "reporte_stock.csv" : "reporte_salidas.csv";
    link.href = url;
    link.setAttribute("download", nombreArchivo);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={mainContainer}>
      <div style={card}>
        <h2>Reportes</h2>
        <p style={{ fontSize: "0.9rem", color: "#666" }}>
          Genera reportes de stock y salidas en formato CSV (compatible con
          Excel).
        </p>
        <button
          style={button}
          type="button"
          onClick={() => descargarCSV("stock")}
        >
          Descargar reporte de stock
        </button>
        <button
          style={button}
          type="button"
          onClick={() => descargarCSV("salidas")}
        >
          Descargar reporte de salidas
        </button>
      </div>
    </div>
  );
}

// --------------------- APP PRINCIPAL (VITE + REACT) ---------------------
export default function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [salidas, setSalidas] = useState([]);

  const isAuth = useMemo(() => !!user, [user]);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div style={appStyles}>
      <Router>
        {/* BARRA SUPERIOR */}
        <header style={headerBar}>
          <div style={brandText}>🌼 Florería Krystal · Sistema de Inventarios</div>
          <div style={navLinks}>
            {isAuth && (
              <>
                <Link to="/" style={linkButton}>
                  Dashboard
                </Link>
                <Link to="/productos" style={linkButton}>
                  Productos
                </Link>
                <Link to="/salidas" style={linkButton}>
                  Salidas
                </Link>
                <Link to="/reportes" style={linkButton}>
                  Reportes
                </Link>
              </>
            )}
            {isAuth ? (
              <>
                <span style={{ fontSize: "0.8rem", color: "#fff" }}>
                  {user.username} ({user.role})
                </span>
                <button
                  style={{
                    ...button,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link to="/login" style={linkButton}>
                Iniciar sesión
              </Link>
            )}
          </div>
        </header>

        {/* RUTAS */}
        <Routes>
          <Route
            path="/login"
            element={<LoginPage onLogin={setUser} />}
          />

          <Route
            path="/"
            element={
              <PrivateRoute isAuth={isAuth}>
                <Dashboard
                  products={products}
                  salidas={salidas}
                  user={user}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/productos"
            element={
              <PrivateRoute isAuth={isAuth}>
                <ProductosPage
                  products={products}
                  setProducts={setProducts}
                  user={user}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/salidas"
            element={
              <PrivateRoute isAuth={isAuth}>
                <SalidasPage
                  products={products}
                  setProducts={setProducts}
                  salidas={salidas}
                  setSalidas={setSalidas}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/reportes"
            element={
              <PrivateRoute isAuth={isAuth}>
                <ReportesPage products={products} salidas={salidas} />
              </PrivateRoute>
            }
          />

          <Route
            path="*"
            element={
              isAuth ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
}
