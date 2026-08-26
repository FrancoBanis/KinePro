import { useState, useEffect, useRef } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'
import FormModal from '../components/FormModal'
import { roleLabels } from '../utils/roles'
import { buscarUsuarios, crearUsuario, actualizarUsuario, desactivarUsuario } from '../services/administrarUsuarios'
import { calcularEdad, obtenerLimitesFechaNacimiento } from '../utils/formateador'
import './AdministrarUsuarios.css'
import type { CreateUserForm, UsuarioData } from '../constants/usuarioData'
import { toast } from 'sonner'

const emptyForm: CreateUserForm = { email: '', nombre: '', apellido: '', fechaNacimiento: '', dni: 0 }
const limitesFechaNacimiento = obtenerLimitesFechaNacimiento()

function AdministrarUsuarios() {
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState<CreateUserForm>(emptyForm)

  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<UsuarioData[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [matchedUser, setMatchedUser] = useState<UsuarioData | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [selectedUser, setSelectedUser] = useState<UsuarioData | null>(null)
  const [editForm, setEditForm] = useState<Partial<UsuarioData>>({})
  const [deactivateLoading, setDeactivateLoading] = useState(false)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.trim().length < 1) {
      setSearchResults([])
      return
    }
    debounceRef.current = setTimeout(async () => {
      try {
        setSearchResults(await buscarUsuarios(query))
      } catch {
        setSearchResults([])
      }
    }, 300)
  }, [query])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setMatchedUser(null)
    setDropdownOpen(true)
  }

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleIngresar()
    }
    if (e.key === 'Escape') {
      setQuery('')
      setSearchResults([])
      setMatchedUser(null)
      setDropdownOpen(false)
    }
  }

  const handleSelectFromDropdown = (user: UsuarioData) => {
    setQuery(user.email)
    setMatchedUser(user)
    setDropdownOpen(false)
  }

  const handleIngresar = () => {
    if (!matchedUser) return
    setSelectedUser(matchedUser)
    setEditForm({ ...matchedUser, rol: String(matchedUser.rol) })
    toast.dismiss()
    setQuery('')
    setMatchedUser(null)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateClose = () => {
    setCreateOpen(false)
    setForm(emptyForm)
  }

  const handleCreateSubmit = async () => {
    if (calcularEdad(form.fechaNacimiento) < 13) {
      toast.error('Edad inválida. La edad mínima es 13 años.')
      return
    }
    try {
      await crearUsuario(form)
      toast.success(`Usuario ${form.nombre} ${form.apellido} creado correctamente.`)
      setForm(emptyForm)
      setCreateOpen(false)
    } catch (err: any) {
      toast.error(err?.message)
    }
  }

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const handleEditClose = () => {
    setSelectedUser(null)
    setEditForm({})
  }

  const handleEditSubmit = async () => {
    try {
      await actualizarUsuario({
        nombre: editForm.nombre,
        apellido: editForm.apellido,
        dni: Number(editForm.dni),
        fechaNacimiento: editForm.fechaNacimiento as string,
        email: selectedUser?.email,
        rol: editForm.rol,
      })
      handleEditClose()
      toast.success('Datos actualizados correctamente.')
    } catch (err: any) {
      toast.error(err?.message)
    }
  }

  const handleDeactivateUser = async () => {
    if (!selectedUser) return
    if (!window.confirm(`¿Desactivar la cuenta de ${selectedUser.nombre} ${selectedUser.apellido}? La cuenta y sus datos se conservarán.`)) return
    setDeactivateLoading(true)
    try {
      await desactivarUsuario(selectedUser.id)
      handleEditClose()
      toast.success('Cuenta desactivada correctamente.')
    } catch (err: any) {
      toast.error(err?.message)
    } finally {
      setDeactivateLoading(false)
    }
  }

  return (
    <div className="admin-usuarios-container">
      <h2 className="admin-usuarios-title">Administrar usuarios</h2>
      <div className="admin-usuarios-header">
        <button className="btn-log" type="button" onClick={() => setCreateOpen(true)}>
          Crear usuario
        </button>
      </div>

      <div className="autocomplete-wrapper">
        <div className="search-row">
          <input
            className="autocomplete-input"
            type="text"
            placeholder="Buscar usuario por email..."
            value={query}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            autoComplete="off"
            spellCheck={false}
          />
          <button className="btn-log" type="button" onClick={handleIngresar} disabled={!matchedUser}>
            Editar
          </button>
        </div>
        {dropdownOpen && searchResults.length > 0 && (
          <ul className="search-dropdown">
            {searchResults.map(user => (
              <li key={user.id} className="search-dropdown-item" onClick={() => handleSelectFromDropdown(user)}>
                {user.email}
              </li>
            ))}
          </ul>
        )}
      </div>

      <FormModal
        isOpen={createOpen}
        onClose={handleCreateClose}
        title="Crear nuevo usuario"
        footer={
          <>
            <button className="btn-secondary" type="button" onClick={handleCreateClose}>
              Cancelar
            </button>
            <button className="btn-log" type="button" onClick={handleCreateSubmit}>
              Crear usuario
            </button>
          </>
        }
      >
        <div className="appointment-form-grid">
          <label className="appointment-field appointment-field-full">
            <span>Email</span>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label className="appointment-field">
            <span>Nombre</span>
            <input name="nombre" value={form.nombre} onChange={handleChange} required />
          </label>
          <label className="appointment-field">
            <span>Apellido</span>
            <input name="apellido" value={form.apellido} onChange={handleChange} required />
          </label>
          <label className="appointment-field">
            <span>Fecha de nacimiento</span>
            <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} min={limitesFechaNacimiento.min} max={limitesFechaNacimiento.max} required />
          </label>
          <label className="appointment-field">
            <span>DNI</span>
            <input type="number" name="dni" value={form.dni} onChange={handleChange} required />
          </label>
        </div>
      </FormModal>

      <FormModal
        isOpen={!!selectedUser}
        onClose={handleEditClose}
        title="Editar usuario"
        footer={
          <>
            <button
              className="btn-danger"
              type="button"
              onClick={handleDeactivateUser}
              disabled={deactivateLoading}
            >
              {deactivateLoading ? 'Desactivando...' : 'Desactivar cuenta'}
            </button>
            <button className="btn-secondary" type="button" onClick={handleEditClose}>
              Cancelar
            </button>
            <button className="btn-log" type="button" onClick={handleEditSubmit}>
              Guardar cambios
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" type="text" value={selectedUser?.email ?? ''} disabled />
        </div>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input className="form-control" type="text" name="nombre" value={editForm.nombre ?? ''} onChange={handleEditChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Apellido</label>
          <input className="form-control" type="text" name="apellido" value={editForm.apellido ?? ''} onChange={handleEditChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">DNI</label>
          <input className="form-control" type="number" name="dni" value={editForm.dni ?? ''} onChange={handleEditChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha de nacimiento</label>
          <input className="form-control" type="date" name="fechaNacimiento" value={editForm.fechaNacimiento ?? ''} onChange={handleEditChange} min={limitesFechaNacimiento.min} max={limitesFechaNacimiento.max} />
        </div>
        <div className="mb-3">
          <label className="form-label">Rol</label>
          <select
            className="form-control"
            name="rol"
            value={editForm.rol ?? selectedUser?.rol ?? ''}
            onChange={e => setEditForm(prev => ({ ...prev, rol: e.target.value }))}
          >
            {Object.entries(roleLabels)
              .filter(([key]) => key.startsWith('ROLE_') && key !== 'ROLE_ADMIN')
              .map(([value, label]) => (<option key={value} value={value}>{label}</option>))}
          </select>
        </div>
      </FormModal>
    </div>
  )
}

export default AdministrarUsuarios
