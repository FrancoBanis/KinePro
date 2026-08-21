import { initMercadoPago } from "@mercadopago/sdk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
let sdkInitialized = false;
interface MercadoPagoProps {
    itemId: number
    tipo: "rutina" | "turno";
    usuarioIdParam?: number;
}
const MercadoPagoWallet = ({ itemId, tipo, usuarioIdParam }: MercadoPagoProps) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const publicKey = "APP_USR-7bbbfd89-6c70-4d85-a025-e26a1ac65063";
  const createPreferenceIdEndPoint = "http://localhost:8080/api/pagos/crear-preferencia";
  useEffect (() => {
    if (!sdkInitialized) {
      initMercadoPago(publicKey,{locale: "es-AR"});
      sdkInitialized = true;
    } else {
      console.log("MercadoPago SDK ya está inicializado");
    }
  }, []);
  
  const createPreferenceFromAPI = async () => {
    try {
      setError(null);

      const response = await axios.post<string>(createPreferenceIdEndPoint, { 
      itemId,
      usuarioId: usuarioIdParam || user?.id,
      tipo
     });
      const preferenceId = response.data;

      if (!preferenceId) {
        throw new Error("No se recibio preferenceId.");
      }

      window.location.assign(
        `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`
      );
    } catch (e) {
      console.error("Error al crear preferencia de Mercado Pago", e);
      setError("No se pudo iniciar el pago. Intenta de nuevo.");
    }
  }
  
  return (
    <div>
      {error && <p className="alert alert-danger mt-2">{error}</p>}
    <div>
      <button className="btn-log" onClick={createPreferenceFromAPI}>Pagar</button>
    </div>
    </div>
  );
};

export default MercadoPagoWallet;
