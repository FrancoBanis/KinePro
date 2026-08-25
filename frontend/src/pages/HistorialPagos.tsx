import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import './HistorialPagos.css'
import { ROUTES } from '../constants/config'
import type { PagoData } from '../constants/pagos'
import { getHistorialPagos } from '../services/historialService'



const moneyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
})

function HistorialPagos() {
  const { user } = useAuth()
  const isLoggedIn = user !== null
  const [payments, setPayments] = useState<PagoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoggedIn) return

    const loadPayments = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getHistorialPagos()
        setPayments(response)
      } catch (requestError: unknown) {
        if (axios.isAxiosError(requestError) && requestError.response?.status === 403) {
          setError('No se pudo validar la sesión para consultar el historial de pagos.')
        } else {
          setError('No se pudo obtener el historial de pagos.')
        }
      } finally {
        setLoading(false)
      }
    }

    void loadPayments()
  }, [isLoggedIn])

  if (!isLoggedIn) return <Navigate to={ROUTES.INICIAR_SESION} replace />

  return (
    <section className="payment-history-page">
      <div className="payment-history-header">
        <div>
          <h1>Historial de pagos</h1>
          <p>Consultá los pagos aprobados de tus turnos y rutinas.</p>
        </div>
        {!loading && !error && payments.length > 0 && (
          <span className="payment-history-count">
            {payments.length} {payments.length === 1 ? 'pago' : 'pagos'}
          </span>
        )}
      </div>

      {loading && <p className="payment-history-status">Cargando pagos...</p>}
      {error && <div className="alert-danger payment-history-status">{error}</div>}
      {!loading && !error && payments.length === 0 && (
        <p className="payment-history-empty">No hay pagos realizados</p>
      )}

      {!loading && !error && payments.length > 0 && (
        <div className="payment-history-table-wrapper">
          <table className="payment-history-table">
            <thead>
              <tr>
                <th>ID del pago</th>
                <th>Fecha</th>
                <th>Rutina</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.idPago}>
                  <td>{payment.idPago}</td>
                  <td>{new Date(payment.fecha).toLocaleString('es-AR')}</td>
                  <td>{payment.concepto}</td>
                  <td>{moneyFormatter.format(payment.monto)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default HistorialPagos
