const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Config (in production use env vars)
const JWT_SECRET = 'cambio_esta_clave_por_una_segura';

// Simple file-based 'DB' for demo (also include SQL schema file for MySQL)
const DATA_FILE = __dirname + '/data/products.json';
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Auth - demo users
const users = [
  { id:1, username:'admin', password:'1234', role:'admin' },
  { id:2, username:'empleado', password:'1234', role:'empleado' }
];
app.post('/api/auth/login', (req,res)=>{
  const { username, password } = req.body;
  const u = users.find(x=>x.username===username && x.password===password);
  if (!u) return res.status(401).json({ message: 'Credenciales inválidas' });
  const token = jwt.sign({ id:u.id, username:u.username, role:u.role }, JWT_SECRET, { expiresIn:'8h' });
  res.json({ token, role: u.role });
});

function ensureAuth(req,res,next){
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ message:'No autorizado' });
  const token = h.split(' ')[1];
  try { req.user = jwt.verify(token, JWT_SECRET); next(); } catch(e){ return res.status(401).json({ message:'Token inválido' }); }
}

// Load/Save helpers
function loadProducts(){ return JSON.parse(fs.readFileSync(DATA_FILE)); }
function saveProducts(arr){ fs.writeFileSync(DATA_FILE, JSON.stringify(arr,null,2)); }

// CRUD endpoints
app.get('/api/products', ensureAuth, (req,res)=>{
  res.json(loadProducts());
});
app.post('/api/products', ensureAuth, (req,res)=>{
  const arr = loadProducts();
  const p = req.body;
  p.id = Date.now();
  arr.push(p);
  saveProducts(arr);
  res.json(p);
});
app.delete('/api/products/:id', ensureAuth, (req,res)=>{
  let arr = loadProducts();
  arr = arr.filter(x=>String(x.id)!==String(req.params.id));
  saveProducts(arr);
  res.json({ ok:true });
});
// Register salida (decrease stock)
app.post('/api/products/:id/out', ensureAuth, (req,res)=>{
  const arr = loadProducts();
  const p = arr.find(x=>String(x.id)===String(req.params.id));
  if (!p) return res.status(404).json({ message:'Producto no encontrado' });
  const cant = Number(req.body.cantidad || 0);
  p.stock = Math.max(0, (p.stock||0) - cant);
  saveProducts(arr);
  // log salida to file
  const logFile = __dirname + '/data/salidas.json';
  let salidas = [];
  if (fs.existsSync(logFile)) salidas = JSON.parse(fs.readFileSync(logFile));
  salidas.push({ productoId:p.id, cantidad:cant, fecha:new Date().toISOString() });
  fs.writeFileSync(logFile, JSON.stringify(salidas,null,2));
  res.json({ ok:true, producto:p });
});

// Reports CSV endpoints (simple)
app.get('/api/reports/stock', ensureAuth, (req,res)=>{
  const arr = loadProducts();
  const header = 'id,nombre,categoria,precio,stock,codigo_barras,localidad\n';
  const rows = arr.map(x=>[x.id,x.nombre,x.categoria,x.precio,x.stock,x.codigo_barras||'',x.localidad||''].join(',')).join('\n');
  res.setHeader('Content-Type','text/csv');
  res.send(header + rows);
});
app.get('/api/reports/salidas', ensureAuth, (req,res)=>{
  const logFile = __dirname + '/data/salidas.json';
  let salidas = [];
  if (fs.existsSync(logFile)) salidas = JSON.parse(fs.readFileSync(logFile));
  const header = 'productoId,cantidad,fecha\n';
  const rows = salidas.map(x=>[x.productoId,x.cantidad,x.fecha].join(',')).join('\n');
  res.setHeader('Content-Type','text/csv');
  res.send(header + rows);
});

// Serve static frontend build if present (optional)
app.use('/', express.static(__dirname + '/public'));

const port = process.env.PORT || 4000;
app.listen(port, ()=>console.log('API listening on', port));
