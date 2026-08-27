import { type RutinaData } from "../constants/rutina";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import "./Cards.css";
import { useAuth } from "../context/AuthContext";
import React, { useEffect } from "react";
import MercadoPagoWallet from "../mercado-pago-checkouts/mercadoPagoWallet/MercadoPagoWallet";
import { useLocationState } from "./hooks/useLocationState";
import EnvioAviso from "./forms/EnviarAvisoModal";
import {handleDesactivarRutina,
  handleEnviarAviso,
  handleCalcularCosto,
  handleCancelarRutina,
  
} from "../services/rutinaService";
import { BotonesUsuarioRutina } from "./BotonesUsuarioRutina";
import { toast } from "sonner";
import { ROUTES } from "../constants/config";

type Props = {
  rutinaRecibida: RutinaData;
  puedeEditar?: boolean;
  onEditar?: () => void;
  modo?: 'publico' | 'misTurnos';
  accionAdicional?: React.ReactNode;
  onRutinaDesactivada?: () => void;
  onCancelarRutina?: () => void;
  onReprogramarRutina?: () => void;
};

export function Rutina({ rutinaRecibida, modo = 'publico', puedeEditar = false, onEditar, accionAdicional, onRutinaDesactivada, onCancelarRutina, onReprogramarRutina }: Props) {
  const [mostrarPopUp, setMostrarPopUp] = React.useState(false);
  const [costoTotal, setCostoTotal] = React.useState<number | null>(null);
  const [loadingTotal, setLoadingTotal] = React.useState(false);
  const [errorTotal, setErrorTotal] = React.useState<string | null>(null);
  const [estaInscripto, setEstaInscripto] = React.useState(false);
  const [loadingInscripcion, setLoadingInscripcion] = React.useState(false)
  const { typedState, navigateWithState } = useLocationState();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    nombre,
    nombresDeProfesionales,
    tipo,
    fechaDeInicio,
    fechaDeFin,
    costoPorTurno,
    cupoMaxRutina,
    cantidadPacientesRutina,
    turnos,
  } = rutinaRecibida;

  const turnosActivos = (turnos || []).filter((t: any) => t.activa);
  const rutinaLlena = (cantidadPacientesRutina ?? 0) >= (cupoMaxRutina ?? Infinity)
    || (turnosActivos.length > 0 && turnosActivos.every(
      (turnoItem) => turnoItem.cantidadDePacientesActuales >= turnoItem.cupoMaxPacientes
    ));
  const tienePacientes = (turnos || []).some(
    (turnoItem) => (turnoItem.pacientes?.length ?? turnoItem.cantidadDePacientesActuales ?? 0) > 0
  );

  const desactivarRutina = async () => {
  if (tienePacientes) {
    toast.error("No se puede desactivar la rutina con pacientes inscriptos.");
    return;
  }
    await handleDesactivarRutina(rutinaRecibida.id, () => {onRutinaDesactivada?.();});
  };

  const enviarAviso = async (texto : String) => {
      await handleEnviarAviso(rutinaRecibida.id, texto);
    };

  const abrirPopUp = async () => {
    if (!user?.id) {
      setErrorTotal("Usuario no válido");
      return;
    }

    setMostrarPopUp(true);
    setLoadingTotal(true);
    setErrorTotal(null);

    try {
      setCostoTotal(await handleCalcularCosto(rutinaRecibida.id, user.id));
    } catch {
      setErrorTotal("Error al calcular el costo total");
    } finally {
      setLoadingTotal(false);
    }
  };

  useEffect(() => {
    if (!user || !user.id) {
      setEstaInscripto(false);
      return;
    }
    const inscriptoPorRutina = (turnos || []).some(
      (turnoItem: any) => (turnoItem.pacientesDesdeRutina ?? []).some((u: any) => u.id === user.id)
    );
    setEstaInscripto(inscriptoPorRutina);
  }, [user?.id, turnos]);
    
  const handleCancelar = async () => {
    setLoadingInscripcion(true);
    try { 
      if (!user || !user.id) return;
      await handleCancelarRutina(rutinaRecibida.id, user.id);
      setEstaInscripto(false);
      toast.success("¡Rutina cancelada con éxito!");
      onCancelarRutina?.();
    } catch (err) {
      toast.error("Error al cancelar la rutina");
    } finally {
      setLoadingInscripcion(false)
    }
  }

  useEffect(() => {
    if (user && typedState && typedState.abrirItemId === rutinaRecibida.id && typedState.tipo === "rutina") {
      navigate(location.pathname, { replace: true, state: {} });
      abrirPopUp();
    }
  }, [user, typedState, rutinaRecibida.id]);


  return (
    <>
      <div className="card card-rutina">
        <div className="card-info">
          <h3>{nombre}</h3>
          <p>Profesionales: {nombresDeProfesionales}</p>
          <p>Tipo de Rutina: {tipo.nombre}</p>
          <p>Fecha de Inicio: {fechaDeInicio}</p>
          <p>Fecha de Fin: {fechaDeFin}</p>
          <p>Costo por Turno: {costoPorTurno}</p>
          <p>Cupo: {cantidadPacientesRutina ?? 0}/{cupoMaxRutina}</p>

          <div className="card-actions">
           {puedeEditar && ( <>
              <EnvioAviso onEnvio={enviarAviso} />     
          <button className="btn-secondary" onClick={desactivarRutina}>
             Desactivar
          </button>
          <button className="btn-secondary" onClick={onEditar}>
            Modificar rutina
          </button>
          </>
          )}
            <BotonesUsuarioRutina
              modo={modo}
              estaInscripto={estaInscripto}
              rutinaLlena={rutinaLlena}
              id={rutinaRecibida.id}
              turnos={turnos}
              usuarioLogueado={!!user}
              loadingInscripcion={loadingInscripcion}
              onCancelar={handleCancelar}
              onAgendar={abrirPopUp}
              onLogin={() => navigateWithState(ROUTES.INICIAR_SESION,{from: location.pathname, abrirItemId: rutinaRecibida.id, tipo:"rutina"})}             
              onReprogramarRutina={onReprogramarRutina}
            />
            {accionAdicional}
          </div>
        </div>
      </div>

      {mostrarPopUp && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Confirmar pago</h2>
            <p>Rutina: {nombre}</p>
            <p>Costo por turno: ${costoPorTurno}</p>
            <p>Hora: {turnosActivos[0]?.hora}</p>
            {loadingTotal && <p>Cargando costo total...</p>}
            {errorTotal && <p>{errorTotal}</p>}
            {costoTotal !== null && <p>Costo Total: ${costoTotal}</p>}
            <div className="modal-actions">
              <button className="btn-log" onClick={() => setMostrarPopUp(false)}>
                Cancelar
              </button>
              <MercadoPagoWallet itemId={rutinaRecibida.id} tipo="rutina" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
function aync() {
  throw new Error("Function not implemented.");
}

