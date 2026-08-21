import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import './HistorialPagos.css'

interface PagoClinicaData {
  idPago: number
  nombreUsuario: string
  correoUsuario: string
  monto: number
  nombreRutina: string
  fecha: string
}

interface PaginaPagosClinica {
  pagos: PagoClinicaData[]
  paginaActual: number
  totalPaginas: number
  totalPagos: number
}

const moneyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
})

function HistorialPagosClinica() {
  const { user } = useAuth()
  const isLoggedIn = user !== null
  const canViewClinicHistory =
    String(user?.rol) === 'ROLE_ADMIN' ||
    String(user?.rol) === 'ROLE_SECRETARIA' ||
    String(user?.rol) === '0' ||
    String(user?.rol) === '1'
  const [payments, setPayments] = useState<PagoClinicaData[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalPayments, setTotalPayments] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!canViewClinicHistory) return

    const loadPayments = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get<PaginaPagosClinica | PagoClinicaData[]>(
          "http://localhost:8080/api/pagos/historial-clinica",
          {
            params: { pagina: currentPage },
            withCredentials: true,
          }
        )
        const data = response.data

        if (Array.isArray(data)) {
          setPayments(data)
          setTotalPages(data.length > 0 ? 1 : 0)
          setTotalPayments(data.length)
        } else {
          setPayments(Array.isArray(data.pagos) ? data.pagos : [])
          setTotalPages(Number(data.totalPaginas) || 0)
          setTotalPayments(Number(data.totalPagos) || 0)
        }
      } catch (requestError: unknown) {
        if (axios.isAxiosError(requestError) && requestError.response?.status === 403) {
          setError('No tenes permisos para consultar el historial de pagos de la clinica.')
        } else {
          setError('No se pudo obtener el historial de pagos de la clinica.')
        }
      } finally {
        setLoading(false)
      }
    }

    void loadPayments()
  }, [canViewClinicHistory, currentPage])

  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (!canViewClinicHistory) return <Navigate to="/" replace />

  return (
    <section className="payment-history-page">
      <div className="payment-history-header">
        <div>
          <h1>Historial de pagos de la clinica</h1>
          <p>Consulta los pagos aprobados de todos los pacientes.</p>
        </div>
        {!loading && !error && totalPayments > 0 && (
          <span className="payment-history-count">
            {totalPayments} {totalPayments === 1 ? 'pago' : 'pagos'}
          </span>
        )}
      </div>

      {loading && <p className="payment-history-status">Cargando pagos...</p>}
      {error && <div className="alert-danger payment-history-status">{error}</div>}
      {!loading && !error && payments.length === 0 && (
        <p className="payment-history-empty">No hay pagos realizados.</p>
      )}

      {!loading && !error && payments.length > 0 && (
        <>
          <div className="payment-history-table-wrapper">
            <table className="payment-history-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Rutina</th>
                  <th>Monto</th>
                  <th>Fecha de pago</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.idPago}>
                    <td>{payment.nombreUsuario}</td>
                    <td>{payment.correoUsuario}</td>
                    <td>{payment.nombreRutina}</td>
                    <td>{moneyFormatter.format(payment.monto)}</td>
                    <td>{new Date(payment.fecha).toLocaleString('es-AR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <nav className="payment-history-pagination" aria-label="Paginacion del historial de pagos">
              <button
                className="btn-secondary"
                type="button"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(page => page - 1)}
              >
                Anterior
              </button>
              <span>
                Pagina {currentPage + 1} de {totalPages}
              </span>
              <button
                className="btn-secondary"
                type="button"
                disabled={currentPage + 1 >= totalPages}
                onClick={() => setCurrentPage(page => page + 1)}
              >
                Siguiente
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  )
}

export default HistorialPagosClinica
