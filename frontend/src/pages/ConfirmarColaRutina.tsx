import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MercadoPagoWallet from "../mercado-pago-checkouts/mercadoPagoWallet/MercadoPagoWallet";
import { recibirRespuestaColaRutina } from "../services/colaRutinaService";

export function ConfirmarColaRutina() {
  const { rutinaId, usuarioId } = useParams<{ rutinaId: string; usuarioId: string }>();
  const [aceptado, setAceptado] = useState(false);
  const [rechazado, setRechazado] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Ocultar la barra superior (header) al montar y restaurar al desmontar
  useEffect(() => {
    const header = document.querySelector("header") || document.querySelector(".header");
    if (header) {
      (header as HTMLElement).style.display = "none";
    }
    return () => {
      if (header) {
        (header as HTMLElement).style.display = "";
      }
    };
  }, []);

  const manejarRespuesta = async (respuesta: boolean) => {
    try {
      setCargando(true);
      await recibirRespuestaColaRutina(Number(rutinaId), Number(usuarioId), respuesta);
      
      if (respuesta) {
        setAceptado(true);
      } else {
        setRechazado(true);
      }
    } catch (e) {
      alert("Ocurrió un error al procesar tu respuesta. Por favor, intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: "1rem" }}>
      <div className="modal-card" style={{ width: "100%", maxWidth: "500px", textAlign: "center" }}>
        <h1 style={{ fontSize: "24px", marginBottom: "1.5rem", color: "var(--color-text)" }}>Confirmar Cupo de Rutina</h1>
        
        {!aceptado && !rechazado && (
          <>
            <p style={{ color: "var(--color-muted)", marginBottom: "1.5rem" }}>
              Se ha liberado un lugar para la rutina completa. ¿Deseás inscribirte y aceptar el cupo?
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button 
                className="btn-log" 
                onClick={() => manejarRespuesta(true)} 
                disabled={cargando}
              >
                {cargando ? "Procesando..." : "Sí, aceptar rutina"}
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => manejarRespuesta(false)} 
                disabled={cargando}
              >
                {cargando ? "Procesando..." : "No, rechazar"}
              </button>
            </div>
          </>
        )}

        {aceptado && (
          <div style={{ marginTop: "1rem" }}>
            <p className="alert alert-success" style={{ backgroundColor: "var(--color-primary-soft)", padding: "12px", borderRadius: "8px", color: "var(--color-primary)", fontWeight: "bold" }}>
              <strong>¡Cupo reservado con éxito!</strong> Para efectivizar y confirmar tu lugar en todos los turnos de la rutina, por favor procedé con el pago.
            </p>
            <div style={{ marginTop: "1.5rem" }}>
              <MercadoPagoWallet 
                itemId={Number(rutinaId)} 
                tipo="rutina" 
                usuarioIdParam={Number(usuarioId)} 
              />
            </div>
          </div>
        )}

        {rechazado && (
          <p style={{ marginTop: "1rem", color: "var(--color-muted)" }}>
            Has rechazado la vacante de la rutina. Liberamos el lugar para el siguiente paciente en la cola de espera. ¡Muchas gracias!
          </p>
        )}
      </div>
    </div>
  );
}

export default ConfirmarColaRutina;