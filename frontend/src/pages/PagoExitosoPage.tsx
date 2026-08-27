
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { procesarPago } from "../services/transaccionService";
import { BACKEND_URL, ROUTES } from "../constants/config";
import { toast } from "sonner";

export function PagoExitoso() {
  const [searchParams] = useSearchParams();
  const [procesando, setProcesando] = useState(true);

  const status = searchParams.get("status");
  const paymentId = searchParams.get("payment_id");

  useEffect(() => {
    const procesar = async () => {
      try {
        if (paymentId  && status) {
          await procesarPago(paymentId);
        }
      } catch (err) {
        toast.error(`Error procesando pago: ${err}`);
      } finally {
        setProcesando(false);
      }
    };

    procesar();
  }, [paymentId, status, BACKEND_URL]);

  return (
    <div>
      <h1>Pago exitoso</h1>
      <p>Gracias por tu compra.</p>

      {status && <p>Estado recibido: {status}</p>}
      {paymentId && <p>Payment ID: {paymentId}</p>}

      {procesando ? (
        <p>Procesando pago y generando turno...</p>
      ) : (
        <Link to={ROUTES.MIS_TURNOS}>Ver mis turnos</Link>
      )}
    </div>
  );
}

export default PagoExitoso;

