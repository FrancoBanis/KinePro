import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MercadoPagoWallet from "../mercado-pago-checkouts/mercadoPagoWallet/MercadoPagoWallet";
import { recibirRespuestaCola } from "../services/colaTurnoService";

export function ConfirmarColaTurno() {
  const { turnoId, usuarioId } = useParams();
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
      await recibirRespuestaCola(Number(turnoId), Number(usuarioId), respuesta);
      
      if (respuesta) {
        setAceptado(true);
      } else {
        setRechazado(true);
      }
    } catch (e) {
      alert("Error al procesar la respuesta.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: "1rem" }}>
      <div className="modal-card" style={{ width: "100%", maxWidth: "500px", textAlign: "center" }}>
        <h1 style={{ fontSize: "24px", marginBottom: "1.5rem", color: "var(--color-text)" }}>Aceptar Turno</h1>
        
        {!aceptado && !rechazado && (
          <>
            <p style={{ color: "var(--color-muted)", marginBottom: "1.5rem" }}>
              El turno se encuentra disponible. ¿Deseás aceptarlo y proceder a guardarlo?
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button 
                className="btn-log" 
                onClick={() => manejarRespuesta(true)} 
                disabled={cargando}
              >
                {cargando ? "Procesando..." : "Sí, aceptar"}
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
              ¡Turno aceptado! Procedé con el pago para confirmar definitivamente tu lugar en el sistema.
            </p>
            <div style={{ marginTop: "1.5rem" }}>
              <MercadoPagoWallet 
                itemId={Number(turnoId)} 
                tipo="turno" 
                usuarioIdParam={Number(usuarioId)}
              />
            </div>
          </div>
        )}

        {rechazado && (
          <p style={{ marginTop: "1rem", color: "var(--color-muted)" }}>
            Has rechazado el turno. Liberamos tu espacio para agilizar el ingreso de otros pacientes. ¡Muchas gracias!
          </p>
        )}
      </div>
    </div>
  );
}

export default ConfirmarColaTurno;