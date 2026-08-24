import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import FormModal from '../components/FormModal'
import { useAuth } from '../context/AuthContext'
import { roleLabels } from '../utils/roles'
import { obtenerLimitesFechaNacimiento } from '../utils/formateador'
import './VerEmpleados.css'
import { ROUTES } from '../constants/config'
import type { UsuarioData } from '../constants/usuarioData'

const limitesFechaNacimiento = obtenerLimitesFechaNacimiento()


function VerEmpleados() {
  const { user } = useAuth()
  const isAdmin = String(user?.rol) === 'ROLE_ADMIN' || String(user?.rol) === '0'

  const [employees, setEmployees] = useState<UsuarioData[]>([])
  const [employeesLoading, setEmployeesLoading] = useState(true)
  const [employeesError, setEmployeesError] = useState<string | null>(null)
  const [pageSuccess, setPageSuccess] = useState<string | null>(null)
  const [employeeActionId, setEmployeeActionId] = useState<number | null>(null)

  const [selectedUser, setSelectedUser] = useState<UsuarioData | null>(null)
  const [editForm, setEditForm] = useState<Partial<UsuarioData>>({})
  const [editError, setEditError] = useState<string | null>(null)
  const [editLoading, setEditLoading] = useState(false)

  const [selectedRoleUser, setSelectedRoleUser] = useState<UsuarioData | null>(null)
  const [roleValue, setRoleValue] = useState('')
  const [roleError, setRoleError] = useState<string | null>(null)
  const [roleLoading, setRoleLoading] = useState(false)

  const loadEmployees = useCallback(async () => {
    setEmployeesLoading(true)
    setEmployeesError(null)
    try {
      const response = await axios.get<UsuarioData[]>(
        "http://localhost:8080/api/auth/users/employees",
        { withCredentials: true }
      )
      setEmployees(response.data)
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        setEmployeesError('La sesión venció. Cerrá sesión e ingresá nuevamente como administrador.')
      } else {
        setEmployeesError(
          axios.isAxiosError(error) && error.response
            ? error.response.data?.message || 'Error al obtener los empleados.'
            : 'Error al conectar con el servidor.'
        )
      }
    } finally {
      setEmployeesLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAdmin) void loadEmployees()
  }, [isAdmin, loadEmployees])

  if (!isAdmin) return <Navigate to={ROUTES.HOME} replace />

  const openEmployeeEditor = (employee: UsuarioData) => {
    setSelectedUser(employee)
    setEditForm({ ...employee })
    setEditError(null)
    setPageSuccess(null)
  }

  const closeEmployeeEditor = () => {
    setSelectedUser(null)
    setEditForm({})
    setEditError(null)
  }

  const openRoleEditor = (employee: UsuarioData) => {
    setSelectedRoleUser(employee)
    setRoleValue(String(employee.rol))
    setRoleError(null)
    setPageSuccess(null)
  }

  const closeRoleEditor = () => {
    setSelectedRoleUser(null)
    setRoleValue('')
    setRoleError(null)
  }

  const handleEditSubmit = async () => {
    if (!selectedUser) return
    setEditError(null)
    setEditLoading(true)
    try {
      await axios.put(
        "http://localhost:8080/api/auth/users",
        {
          nombre: editForm.nombre,
          apellido: editForm.apellido,
          dni: Number(editForm.dni),
          fechaNacimiento: editForm.fechaNacimiento,
          email: selectedUser.email,
          rol: selectedUser.rol,
        },
        { withCredentials: true }
      )
      closeEmployeeEditor()
      setPageSuccess('Datos actualizados correctamente.')
      await loadEmployees()
    } catch (error: unknown) {
      setEditError(
        axios.isAxiosError(error) && error.response
          ? error.response.data?.message || 'Error al guardar cambios.'
          : 'Error al conectar con el servidor.'
      )
    } finally {
      setEditLoading(false)
    }
  }

  const handleRoleSubmit = async () => {
    if (!selectedRoleUser) return
    setRoleError(null)
    setRoleLoading(true)
    try {
      await axios.patch(
        `http://localhost:8080/api/auth/users/${selectedRoleUser.id}/role`,
        { rol: roleValue },
        { withCredentials: true }
      )
      closeRoleEditor()
      setPageSuccess('Rol actualizado correctamente.')
      await loadEmployees()
    } catch (error: unknown) {
      setRoleError(
        axios.isAxiosError(error) && error.response
          ? error.response.data?.message || 'Error al modificar el rol.'
          : 'Error al conectar con el servidor.'
      )
    } finally {
      setRoleLoading(false)
    }
  }

  const handleDeactivateEmployee = async (employee: UsuarioData) => {
    if (!window.confirm(`¿Desactivar la cuenta de ${employee.nombre} ${employee.apellido}? La cuenta y sus datos se conservarán.`)) return

    setEmployeeActionId(employee.id)
    setEmployeesError(null)
    setPageSuccess(null)
    try {
      await axios.patch(
        `http://localhost:8080/api/auth/users/${employee.id}/desactivar`,
        undefined,
        { withCredentials: true }
      )
      setPageSuccess('Cuenta desactivada correctamente.')
      await loadEmployees()
    } catch (error: unknown) {
      setEmployeesError(
        axios.isAxiosError(error) && error.response
          ? error.response.data?.message || 'Error al desactivar la cuenta.'
          : 'Error al conectar con el servidor.'
      )
    } finally {
      setEmployeeActionId(null)
    }
  }

  return (
    <div className="employees-page">
      <div className="employees-page-header">
        <h2>Ver empleados</h2>
        {!employeesLoading && !employeesError && employees.length > 0 && (
          <span className="employees-count">
            {employees.length} {employees.length === 1 ? 'empleado' : 'empleados'}
          </span>
        )}
      </div>

      {pageSuccess && <div className="alert-success employees-feedback">{pageSuccess}</div>}
      {employeesLoading && <p className="employees-status">Cargando empleados...</p>}
      {employeesError && <div className="alert-danger employees-feedback">{employeesError}</div>}
      {!employeesLoading && !employeesError && employees.length === 0 && (
        <p className="employees-status">No existen empleados para mostrar</p>
      )}

      {!employeesLoading && !employeesError && employees.length > 0 && (
        <div className="employees-table-card">
          <div className="employees-table-wrapper">
            <table className="employees-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(employee => (
                  <tr key={employee.id}>
                    <td>{employee.nombre} {employee.apellido}</td>
                    <td>{employee.email}</td>
                    <td>{roleLabels[String(employee.rol)] ?? employee.rol}</td>
                    <td>
                      <div className="employee-row-actions">
                        <button
                          className="employee-action-button"
                          type="button"
                          onClick={() => openEmployeeEditor(employee)}
                        >
                          Modificar usuario
                        </button>
                        <button
                          className="employee-action-button"
                          type="button"
                          onClick={() => openRoleEditor(employee)}
                        >
                          Modificar rol
                        </button>
                        <button
                          className="employee-action-button employee-action-danger"
                          type="button"
                          onClick={() => handleDeactivateEmployee(employee)}
                          disabled={employeeActionId === employee.id}
                        >
                          {employeeActionId === employee.id ? 'Desactivando...' : 'Desactivar cuenta'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <FormModal
        isOpen={!!selectedUser}
        onClose={closeEmployeeEditor}
        title="Modificar usuario"
        footer={
          <>
            <button className="btn-secondary" type="button" onClick={closeEmployeeEditor}>
              Cancelar
            </button>
            <button className="btn-log" type="button" onClick={handleEditSubmit} disabled={editLoading}>
              {editLoading ? 'Guardando...' : 'Guardar cambios'}
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
          <input
            className="form-control"
            type="text"
            value={editForm.nombre ?? ''}
            onChange={event => setEditForm(previous => ({ ...previous, nombre: event.target.value }))}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Apellido</label>
          <input
            className="form-control"
            type="text"
            value={editForm.apellido ?? ''}
            onChange={event => setEditForm(previous => ({ ...previous, apellido: event.target.value }))}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">DNI</label>
          <input
            className="form-control"
            type="number"
            value={editForm.dni ?? ''}
            onChange={event => setEditForm(previous => ({ ...previous, dni: Number(event.target.value) }))}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha de nacimiento</label>
          <input
            className="form-control"
            type="date"
            value={editForm.fechaNacimiento ?? ''}
            onChange={event => setEditForm(previous => ({ ...previous, fechaNacimiento: event.target.value }))}
            min={limitesFechaNacimiento.min}
            max={limitesFechaNacimiento.max}
          />
        </div>
        {editError && <div className="alert-danger mt-2">{editError}</div>}
      </FormModal>

      <FormModal
        isOpen={!!selectedRoleUser}
        onClose={closeRoleEditor}
        title="Modificar rol"
        footer={
          <>
            <button className="btn-secondary" type="button" onClick={closeRoleEditor}>
              Cancelar
            </button>
            <button className="btn-log" type="button" onClick={handleRoleSubmit} disabled={roleLoading}>
              {roleLoading ? 'Guardando...' : 'Guardar rol'}
            </button>
          </>
        }
      >
        <p className="role-user-summary">
          {selectedRoleUser?.nombre} {selectedRoleUser?.apellido} · {selectedRoleUser?.email}
        </p>
        <div className="mb-3">
          <label className="form-label">Rol</label>
          <select
            className="form-control"
            value={roleValue}
            onChange={event => setRoleValue(event.target.value)}
          >
            {Object.entries(roleLabels)
              .filter(([key]) => key.startsWith('ROLE_') && key !== 'ROLE_ADMIN')
              .map(([value, label]) => (<option key={value} value={value}>{label}</option>))}
          </select>
        </div>
        {roleError && <div className="alert-danger mt-2">{roleError}</div>}
      </FormModal>
    </div>
  )
}

export default VerEmpleados
