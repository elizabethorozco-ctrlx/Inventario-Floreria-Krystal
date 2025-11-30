Florería Krystal - Sistema de Inventarios (Scaffold)
Contenido del paquete:
- frontend/  -> React frontend (simple scaffold)
- backend/   -> Node + Express API with JWT auth (demo), file-based data store and endpoints
- data/products_seed.json -> Seed generated from your Excel file (Productos Floreria Krystal.xlsx)
- migrations/schema.sql -> MySQL schema to create DB/tables
- README.md  -> This file
- 1) Backend Node + Express + ejemplo de conexión a MySQL y endpoints CRUD.
   - Archivo: backend/index.js
   - Endpoints: /api/auth/login, /api/products (GET, POST, DELETE), /api/products/:id/out
   - Requieren Authorization: Bearer <token> (use /api/auth/login)

2) Conexión React <-> Backend
   - Frontend example uses axios to call /api endpoints. In production, configure proxy or deploy backend + frontend under same domain.

3) Importación directa del Excel a la BD
   - Generamos data/products_seed.json with the products read from your Excel.
   - Proveer script Node en backend/import_products.js que conecta a MySQL y hace REPLACE INTO products.

4) Roles y autenticación (demo)
   - Usuarios de ejemplo en backend: admin/1234 y empleado/1234
   - JWT secret en backend/index.js (cámbialo por una variable de entorno en producción).

5) ZIP del proyecto
   - Archivo: /mnt/data/FloreriaKrystalInventory.zip (incluye todo)

6) Diseño visual (colores corporativos: amarillo / naranja)
   - Frontend usa paleta #FFA726 (naranja) y #FFB300 (amarillo) y tipografías Lucida Console / Courier New / monospace.
   - 

7) Integración de backlog y sprint
   - El scaffold incluye endpoints y vistas que cubren las fases del backlog: alta/editar/eliminar productos, registro de salidas, reportes CSV, panel/dashboard, formulario de productos, gestión de usuarios (básica).
