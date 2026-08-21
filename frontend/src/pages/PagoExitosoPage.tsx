import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export function PagoExitoso() {
  const [searchParams] = useSearchParams();
  const [procesando, setProcesando] = useState(true);

  const status = searchParams.get("status");
  const paymentId = searchParams.get("payment_id");

  const backendUrl = "http://localhost:8080";

  useEffect(() => {
    const procesarPago = async () => {
      try {
        if (paymentId && status === "approved") {
          await axios.post(
            `${backendUrl}/api/webhook/mercadopago`,
            {
              
              type: "payment",
              data: {
                id: paymentId,
              },
            },
            {
              withCredentials: true,
            }
          );
        }
      } catch (err) {
        console.error("Error procesando pago:", err);
      } finally {
        setProcesando(false);
      }
    };

    procesarPago();
  }, [paymentId, status, backendUrl]);

  return (
    <div>
      <h1>Pago exitoso</h1>
      <p>Gracias por tu compra.</p>

      {status && <p>Estado recibido: {status}</p>}
      {paymentId && <p>Payment ID: {paymentId}</p>}

      {procesando ? (
        <p>Procesando pago y generando turno...</p>
      ) : (
        <Link to="http://localhost:5173/mis-turnos">Ver mis turnos</Link>
      )}
    </div>
  );
}

export default PagoExitoso;

