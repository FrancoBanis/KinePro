import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './HomePage.css'
import { useAuth } from '../context/AuthContext'
import { Turno } from '../components/Turno'
import type { TurnoData } from '../constants/turno'
import { getMisTurnosProfesional } from '../services/turnoService'
import { ROUTES } from '../constants/config'

export function ActividadesPage() {
  const { user } = useAuth()
  const [turnos, setTurnos] = useState<TurnoData[]>([])
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<TurnoData | null>(null)

  const esProfesional =
    user?.rol?.toString() === 'ROLE_PROFESIONALES' ||
    user?.rol?.toString() === '2'

  useEffect(() => {
    if (!user?.id || !esProfesional) return

    const cargarTurnos = async () => {
      try {
        const data = await getMisTurnosProfesional(user.id!)
        setTurnos(data)
      } catch {
        console.error('Error al cargar turnos del profesional')
      }
    }

    cargarTurnos()
  }, [user?.id, esProfesional])

  const turnosVisibles = [...turnos].sort((a, b) => {
    const aInactivo = a.activa === false ? 1 : 0
    const bInactivo = b.activa === false ? 1 : 0
    return aInactivo - bInactivo
  })

  return (
    <main className="page-container">
      <style>{`
        .actividades-col .card-info .btn-log {
          display: none !important;
        }
        .actividades-col .btn-ver-pacientes {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .actividades-col .btn-ver-pacientes:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-strong);
        }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1"></h1>
          <p className="text-muted mb-0">
            Aquí se muestran los turnos en los que estás asignado.
          </p>
        </div>
      </div>

      {!user ? (
        <div className="alert alert-secondary">Debes iniciar sesión para consultar tus actividades.</div>
      ) : !esProfesional ? (
        <div className="alert alert-secondary">Esta página está disponible solo para usuarios con rol Profesional.</div>
      ) : turnosVisibles.length === 0 ? (
        <div className="alert alert-secondary">No tenés turnos asignados actualmente.</div>
      ) : (
        <div className="row g-4">
          {turnosVisibles.map((turno) => (
            <div key={turno.id} className="col-12 col-md-6 col-lg-4 actividades-col" style={{ position: 'relative' }}>
              <Turno turnoRecibido={turno} modo="publico" />
              <button
                className="btn-log btn-ver-pacientes"
                style={{ position: 'absolute', bottom: '22px', right: '22px', zIndex: 1 }}
                onClick={() => setTurnoSeleccionado(turno)}
              >
                Ver Pacientes
              </button>
            </div>
          ))}
        </div>
      )}

      {turnoSeleccionado && (
        <div className="modal-overlay" onClick={() => setTurnoSeleccionado(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Pacientes asignados</h2>
            <p style={{ marginBottom: '15px' }}>
              <strong>Turno:</strong> {turnoSeleccionado.dia} - {turnoSeleccionado.hora}
            </p>
            {turnoSeleccionado.pacientes && turnoSeleccionado.pacientes.length > 0 ? (
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {(turnoSeleccionado.pacientes as unknown[]).map((paciente: unknown, idx: number) => {
                  const p = paciente as Record<string, unknown>
                  return (
                    <li key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                      {String(p.nombre)} {String(p.apellido)}
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p>No hay pacientes asignados a este turno.</p>
            )}
            <div className="modal-actions">
              <button className="btn-log" onClick={() => setTurnoSeleccionado(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <Link className="btn-log" to={ROUTES.RUTINAS}>
          Volver a rutinas
        </Link>
      </div>
    </main>
  )
}
