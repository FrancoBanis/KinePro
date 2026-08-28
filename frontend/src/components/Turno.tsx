// frontend/src/components/Turno.tsx
import React, { useEffect, useCallback } from "react";
import { type TurnoData } from "../constants/turno";
import MercadoPagoWallet from "../mercado-pago-checkouts/mercadoPagoWallet/MercadoPagoWallet";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocationState } from "./hooks/useLocationState";
import { getCostoTurno, getRutina } from "../services/turnoService";
import "./Cards.css";
import { BotonesUsuarioTurno } from "./BotonesUsuarioTurno";
import { formatearDiaEnEspanol, formatearFechaEnEspanol } from "../utils/formateador";
import { ROUTES } from "../constants/config";
type Props = {
  turnoRecibido: TurnoData;
  modo?: "publico" | "misTurnos";
  onCancelarTurno?: () => void;
  onReprogramarTurno?: () => void;
};


export function Turno({ turnoRecibido, modo = "publico", onCancelarTurno, onReprogramarTurno }: Props) {
    const location = useLocation();
    const navigate = useNavigate();
  
  const [mostrarPopUp, setMostrarPopUp] = React.useState(false);
  const [costo, setCosto] = React.useState<number | null>(null);
  const [loadingTotal, setLoadingTotal] = React.useState(false);
  const [errorTotal, setErrorTotal] = React.useState<string | null>(null);
  const [rutina, setRutina] = React.useState<{ nombre?: string } | null>(null);
  const { user } = useAuth();
  const { typedState, navigateWithState } = useLocationState();
 const [cantidadPacientes, setCantidadPacientes] = React.useState(
    turnoRecibido.cantidadDePacientesActuales ?? turnoRecibido.pacientes?.length ?? 0
  );
  const inactivo = turnoRecibido.activa === false;  

  const abrirPopUp = useCallback(async () => {
    setMostrarPopUp(true);
    setLoadingTotal(true);
    setErrorTotal(null);
    try {
      const response = await getCostoTurno(turnoRecibido.id);
      setCosto(response);
    } catch {
      setErrorTotal("Error al calcular el costo");
    } finally {
      setLoadingTotal(false);
    }
  }, [turnoRecibido.id]);

  // Busco informacion de la rutina del turno.
  const actualizarTurno = async () => {
    if (!turnoRecibido.id_rutina) return;
    try {
      const data = await getRutina(turnoRecibido.id_rutina);
      setRutina(data);
    } catch (err) {
      console.error("Error al cargar rutina: ", err);
    }
  };

  useEffect(() => {
    actualizarTurno();
  }, []
  );
  useEffect(() => {
    if (user && typedState && typedState.abrirItemId === turnoRecibido.id && typedState.tipo === "turno") {
      navigate(location.pathname, { replace: true, state: {} });
      abrirPopUp();
    }
  }, [user, typedState, turnoRecibido.id]);


  return (
    <>
      <div className={`card card-turno${inactivo ? ' card-turno--inactive' : ''}`}>
        <div className="card-info">
          {modo === "publico" && (
          <h4 className="mtr-rutina-titulo">Turno correspondiente a la rutina: <strong>{rutina?.nombre}</strong></h4>)
          }
          <p><strong>Día:</strong> {formatearDiaEnEspanol(turnoRecibido.dia)}</p>
          <p><strong>Fecha:</strong> {formatearFechaEnEspanol(turnoRecibido.fecha)}</p>
          <p><strong>Hora:</strong> {turnoRecibido.hora}</p>
          {modo == "publico" && (
          <p><strong>Pacientes inscriptos:</strong> {cantidadPacientes} / {turnoRecibido.cupoMaxPacientes}</p>)
          }
          {turnoRecibido.profesionales && turnoRecibido.profesionales.length > 0 && (
            <div className="mtr-profesionales">
              {turnoRecibido.profesionales.map((prof) => (
                <span className="mtr-profesional-chip" key={prof.id}>
                  {prof.nombre} {prof.apellido}
                </span>
              ))}
            </div>
          )}
          
          <BotonesUsuarioTurno
            modo={modo}
            turnoLleno={cantidadPacientes >= turnoRecibido.cupoMaxPacientes}
            id={turnoRecibido.id}
            usuarioLogueado={!!user}
            onAgendar={abrirPopUp}
            onLogin={() => navigateWithState(ROUTES.INICIAR_SESION,{from: location.pathname, abrirItemId: turnoRecibido.id, tipo:"turno"})}
            onCancelar={() => {
              actualizarTurno();
              onCancelarTurno?.();
            }}
            onReprogramar={() => {
              actualizarTurno();
              onReprogramarTurno?.();
            }}  
          />
          
        </div>
      </div>

      {mostrarPopUp && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Confirmar pago</h2>
            <p><strong>Turno correspondiente a la rutina:</strong> {rutina?.nombre}</p>
            <p><strong>Costo por turno:</strong> ${costo}</p>
            <p><strong>Día:</strong> {formatearDiaEnEspanol(turnoRecibido.dia)}</p>
            <p><strong>Fecha:</strong> {formatearFechaEnEspanol(turnoRecibido.fecha)}</p>
            <p><strong>Hora:</strong> {turnoRecibido.hora}</p>
            {loadingTotal && <p><span className="button-spinner" aria-hidden="true" /> Cargando costo total...</p>}
            {errorTotal && <p>{errorTotal}</p>}
            {costo !== null && <p><strong>Costo Total:</strong> ${costo}</p>}
            <div className="modal-actions">
              <button className="btn-log" onClick={() => setMostrarPopUp(false)}>
                Cancelar
              </button>
              <MercadoPagoWallet itemId={turnoRecibido.id} tipo="turno" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}