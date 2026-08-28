import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { procesarPago } from "../services/transaccionService";
import { BACKEND_URL, ROUTES } from "../constants/config";
import { toast } from "sonner";
import "./PagoResultado.css";

export function PagoExitoso() {
  const [searchParams] = useSearchParams();
  const [procesando, setProcesando] = useState(true);

  const status = searchParams.get("status");
  const paymentId = searchParams.get("payment_id");

  useEffect(() => {
    const procesar = async () => {
      try {
        if (paymentId && status) {
          await procesarPago(paymentId);
        }
      } catch (err) {
        toast.error(`Error procesando pago: ${err}`);
      } finally {
        setProcesando(false);
      }
    };

    procesar();
  }, [paymentId, status]);

  return (
    <div className="pago-resultado-container">
      <div className="pago-card">
        <div className="pago-icono exito">
          <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1 className="pago-titulo">¡Pago exitoso!</h1>
        <p className="pago-texto">Tu transacción se completó correctamente.</p>

        {(status || paymentId) && (
          <div className="pago-detalles">
            {status && <p><strong>Estado:</strong> {status}</p>}
            {paymentId && <p><strong>Comprobante:</strong> #{paymentId}</p>}
          </div>
        )}

        {procesando ? (
          <div style={{ marginTop: '20px' }}>
            <div className="pago-spinner"></div>
            <p className="pago-texto" style={{ fontSize: '0.9rem' }}>Procesando pago y generando turno...</p>
          </div>
        ) : (
          <Link to={ROUTES.MIS_TURNOS} className="btn-pago btn-pago-exito">
            Ver mis turnos
          </Link>
        )}
      </div>
    </div>
  );
}

export default PagoExitoso;