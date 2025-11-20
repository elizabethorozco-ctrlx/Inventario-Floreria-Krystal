import React, {useState, useEffect} from 'react'
import { getProducts, saveProducts, exportCSV } from '../utils'

export default function Products({user}){
  const [products, setProducts] = useState(getProducts())
  const [form, setForm] = useState({name:'', sku:'', location:'', stock:0, price:0})
  useEffect(()=> saveProducts(products), [products])
  function addOrUpdate(e){
    e.preventDefault()
    if(!form.name) return alert('Nombre requerido')
    if(form.id){
      setProducts(products.map(p=> p.id===form.id ? {...p,...form} : p))
    } else {
      const id = Date.now()
      setProducts([{...form,id}, ...products])
    }
    setForm({name:'', sku:'', location:'', stock:0, price:0})
  }
  function edit(p){ setForm(p) }
  function del(id){ if(confirm('Eliminar producto?')) setProducts(products.filter(p=>p.id!==id)) }
  function changeStock(id, delta){
    setProducts(products.map(p=> p.id===id ? {...p, stock: Number(p.stock)+Number(delta)} : p))
  }
  return (
    <div>
      <h2>Productos</h2>
      <form onSubmit={addOrUpdate}>
        <div className="form-row"><input placeholder="Nombre" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
        <div className="form-row"><input placeholder="SKU / Código" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} /></div>
        <div className="form-row"><input placeholder="Localización" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} /></div>
        <div className="form-row"><input type="number" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form,stock:Number(e.target.value)})} /></div>
        <div className="form-row"><input type="number" placeholder="Precio" value={form.price} onChange={e=>setForm({...form,price:Number(e.target.value)})} /></div>
        <button type="submit">{form.id ? 'Actualizar' : 'Agregar'}</button>
      </form>

      <div style={{marginTop:12}}>
        <button onClick={()=> exportCSV('productos.csv', products)}>Exportar CSV</button>
      </div>

      <table>
        <thead><tr><th>Nombre</th><th>SKU</th><th>Local</th><th>Stock</th><th>Precio</th><th>Acciones</th></tr></thead>
        <tbody>
          {products.map(p=>(
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>{p.location}</td>
              <td>{p.stock}</td>
              <td>{p.price}</td>
              <td>
                <button onClick={()=>edit(p)}>Editar</button>
                <button onClick={()=>del(p.id)}>Eliminar</button>
                <button onClick={()=>{ const q = prompt('Cantidad a ingresar (positivo) o salir (negativo)'); if(q) changeStock(p.id, Number(q))}}>Entrada/Salida</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
