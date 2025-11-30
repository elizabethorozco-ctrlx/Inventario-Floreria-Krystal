/*
Node script to import products_seed.json into MySQL.
Usage: configure DB connection below, then run: node import_products.js
*/
const mysql = require('mysql2/promise');
const fs = require('fs');
async function run(){
  const seed = JSON.parse(fs.readFileSync(__dirname + '/data/products.json'));
  const conn = await mysql.createConnection({ host:'localhost', user:'root', password:'', database:'floreria_krystal' });
  for (const p of seed){
    await conn.query('REPLACE INTO products (id,nombre,categoria,precio,stock,codigo_barras,localidad) VALUES (?,?,?,?,?,?,?)', [p.id,p.nombre,p.categoria || '', p.precio || 0, p.stock || 0, p.codigo_barras || '', p.localidad || '']);
  }
  console.log('Import completo. Registros:', seed.length);
  await conn.end();
}
run().catch(err=>{ console.error(err); process.exit(1); });
