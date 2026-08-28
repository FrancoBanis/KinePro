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
  const rutinaLlena = (cantidadPacientesRutina ?? 0) >= (cupoMaxRutina)
;
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


  const botonesUsuario = (
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
  );

  return (
    <>
      {modo === 'misTurnos' ? (
        <div className="mtr-rutina-header">
          <h3 className="mtr-rutina-titulo">{nombre}</h3>
          <div className="mtr-rutina-info">
            <span><strong>Profesionales:</strong> {nombresDeProfesionales}</span>
            <span><strong>Tipo:</strong> {tipo.nombre}</span>
            <span><strong>Del</strong> {fechaDeInicio} <strong>al</strong> {fechaDeFin}</span>
            <span><strong>Costo/turno:</strong> ${costoPorTurno}</span>
            <span><strong>Cupo de la rutina:</strong> {cantidadPacientesRutina ?? 0}/{cupoMaxRutina}</span>
          </div>
          <div className="mtr-rutina-acciones">
            {puedeEditar && (
              <>
                <EnvioAviso onEnvio={enviarAviso} />
                <button className="btn-secondary" onClick={desactivarRutina}>
                  Desactivar
                </button>
                <button className="btn-secondary" onClick={onEditar}>
                  Modificar rutina
                </button>
              </>
            )}
            {botonesUsuario}
            {accionAdicional}
          </div>
        </div>
      ) : (
        <div className="card card-rutina">
          <div className="card-info">
            <h3 className="mtr-rutina-titulo">{nombre}</h3>
            <p><strong>Profesionales:</strong> {nombresDeProfesionales}</p>
            <p><strong>Tipo de Rutina:</strong> {tipo.nombre}</p>
            <p><strong>Fecha de Inicio:</strong> {fechaDeInicio}</p>
            <p><strong>Fecha de Fin:</strong> {fechaDeFin}</p>
            <p><strong>Costo por Turno:</strong> {costoPorTurno}</p>
            <p><strong>Cupo de la rutina:</strong>{cantidadPacientesRutina ?? 0}/{cupoMaxRutina}</p>

            <div className="card-actions">
              {puedeEditar && (
                <>
                  <EnvioAviso onEnvio={enviarAviso} />
                  <button className="btn-secondary" onClick={desactivarRutina}>
                    Desactivar
                  </button>
                  <button className="btn-secondary" onClick={onEditar}>
                    Modificar rutina
                  </button>
                </>
              )}
              {botonesUsuario}
              {accionAdicional}
            </div>
          </div>
        </div>
      )}

      {mostrarPopUp && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2><strong>Confirmar pago</strong></h2>
            <p><strong>Rutina:</strong> {nombre}</p>
            <p><strong>Costo por turno:</strong> ${costoPorTurno}</p>
            <p><strong>Hora:</strong> {turnosActivos[0]?.hora}</p>
            {loadingTotal && <p>Cargando costo total...</p>}
            {errorTotal && <p>{errorTotal}</p>}
            {costoTotal !== null && <p><strong>Costo Total:</strong> ${costoTotal}</p>}
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
