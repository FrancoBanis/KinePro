// frontend/src/components/Turno.tsx
import React, { useEffect, useCallback } from "react";
import { type TurnoData } from "../constants/turno";
import MercadoPagoWallet from "../mercado-pago-checkouts/mercadoPagoWallet/MercadoPagoWallet";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocationState } from "./hooks/useLocationState";
import { getCostoTurno, getRutina, estaInscriptoEnTurno, cancelarTurno } from "../services/turnoService";
import "./Cards.css";
import { BotonesUsuarioTurno } from "./BotonesUsuarioTurno";
import { formatearDiaEnEspanol, formatearFechaEnEspanol } from "../utils/formateador";
import { ROUTES } from "../constants/config";



export function Turno({ turnoRecibido, modo = "publico" }: { turnoRecibido: TurnoData; modo? : "publico" | "misTurnos"})   {
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
  useEffect(() => {
    if (!turnoRecibido.id_rutina) return;
    getRutina(turnoRecibido.id_rutina)
    .then(setRutina)
    .catch(err => console.error("Error al cargar rutina: ", err));
    }, [turnoRecibido.id]
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
          <h3>Turno correspondiente a la rutina: {rutina?.nombre}</h3>)
          }
          <p>Día: {formatearDiaEnEspanol(turnoRecibido.dia)}</p>
          <p>Fecha: {formatearFechaEnEspanol(turnoRecibido.fecha)}</p>
          <p>Hora: {turnoRecibido.hora}</p>
          {modo == "publico" && (
          <p>Pacientes inscriptos: {cantidadPacientes} / {turnoRecibido.cupoMaxPacientes}</p>)
          }
          
          <BotonesUsuarioTurno
            modo={modo}
            turnoLleno={cantidadPacientes >= turnoRecibido.cupoMaxPacientes}
            id={turnoRecibido.id}
            usuarioLogueado={!!user}
            onAgendar={abrirPopUp}
            onLogin={() => navigateWithState(ROUTES.INICIAR_SESION,{from: location.pathname, abrirItemId: turnoRecibido.id, tipo:"turno"})}
          />
          
        </div>
      </div>

      {mostrarPopUp && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Confirmar pago</h2>
            <p>Turno correspondiente a la rutina: {rutina?.nombre}</p>
            <p>Costo por turno: ${costo}</p>
            <p>Día: {formatearDiaEnEspanol(turnoRecibido.dia)}</p>
            <p>Fecha: {formatearFechaEnEspanol(turnoRecibido.fecha)}</p>
            <p>Hora: {turnoRecibido.hora}</p>
            {loadingTotal && <p><span className="button-spinner" aria-hidden="true" /> Cargando costo total...</p>}
            {errorTotal && <p>{errorTotal}</p>}
            {costo !== null && <p>Costo Total: ${costo}</p>}
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