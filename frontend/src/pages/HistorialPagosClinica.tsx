import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import './HistorialPagos.css'
import { ROUTES } from '../constants/config'
import type { PagoClinicaData } from '../constants/pagos'
import { getHistorialPagosClinica } from '../services/historialService'
import { toast } from 'sonner'



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

  useEffect(() => {
    if (!canViewClinicHistory) return

    const loadPayments = async () => {
      setLoading(true)
      try {
        const response = await getHistorialPagosClinica(currentPage)

        if (Array.isArray(response)) {
          setPayments(response)
          setTotalPages(response.length > 0 ? 1 : 0)
          setTotalPayments(response.length)
        } else {
          setPayments(Array.isArray(response.pagos) ? response.pagos : [])
          setTotalPages(Number(response.totalPaginas) || 0)
          setTotalPayments(Number(response.totalPagos) || 0)
        }
      } catch (requestError: unknown) {
        if (axios.isAxiosError(requestError) && requestError.response?.status === 403) {
          toast.error('No tenes permisos para consultar el historial de pagos de la clinica.')
        } else {
          toast.error('No se pudo obtener el historial de pagos de la clinica.')
        }
      } finally {
        setLoading(false)
      }
    }

    void loadPayments()
  }, [canViewClinicHistory, currentPage])

  if (!isLoggedIn) return <Navigate to={ROUTES.INICIAR_SESION} replace />
  if (!canViewClinicHistory) return <Navigate to={ROUTES.HOME} replace />

  return (
    <section className="payment-history-page">
      <div className="payment-history-header">
        <div>
          <h1>Historial de pagos de la clinica</h1>
          <p>Consulta los pagos aprobados de todos los pacientes.</p>
        </div>
        {!loading && totalPayments > 0 && (
          <span className="payment-history-count">
            {totalPayments} {totalPayments === 1 ? 'pago' : 'pagos'}
          </span>
        )}
      </div>

      {loading && <p className="payment-history-status">Cargando pagos...</p>}
      {!loading && payments.length === 0 && (
        <p className="payment-history-empty">No hay pagos realizados.</p>
      )}

      {!loading && payments.length > 0 && (
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
