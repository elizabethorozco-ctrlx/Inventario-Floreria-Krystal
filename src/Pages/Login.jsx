import React, {useState} from 'react'
export default function Login({onLogin}){
  const [name, setName] = useState('')
  const [role, setRole] = useState('employee')
  function submit(e){
    e.preventDefault()
    if(!name) return alert('Nombre requerido')
    onLogin({name, role})
  }
  return (
    <div>
      <h2>Iniciar sesión (mock)</h2>
      <form onSubmit={submit}>
        <div className="form-row"><input placeholder="Nombre" value={name} onChange={e=>setName(e.target.value)} /></div>
        <div className="form-row">
          <label>Rol: </label>
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="admin">Administrador</option>
            <option value="employee">Almacén / Vendedor</option>
          </select>
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  )
}
