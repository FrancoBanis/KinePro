import React, { useEffect } from "react";
import type { TurnoData } from "../constants/turno";
import "./BotonesUsuario.css";
import { useAuth } from "../context/AuthContext";
import { calcularReembolso, cancelarTurno, estaInscriptoEnTurno, getTurnosSimilares, reprogramarTurno, agregarAColaEspera } from "../services/turnoService";
import { formatearDiaEnEspanol, formatearFechaEnEspanol } from "../utils/formateador";
import { createPortal } from "react-dom";
import type { reembolsoDTO } from "../constants/reembolso";
import { toast } from "sonner";


type Modo = "publico" | "misTurnos" ;
interface Props {
    modo : Modo;
    id: number;
    turnoLleno: Boolean;
    usuarioLogueado: Boolean;
    tipoRutina?: string;
    onAgendar: () => void;
    onLogin: () => void;
    onCancelar?: () => void;
    onReprogramar?: () => void;
}

export function BotonesUsuarioTurno({
    modo,
    id,
    turnoLleno,
    usuarioLogueado,
    onAgendar,
    onLogin,
    onCancelar = () => {},
    onReprogramar = () => {},
} :  Props) {
    const { user } = useAuth();
  const [mostrarPopUpReprogramar, setMostrarPopUpReprogramar] = React.useState(false);
  const [turnosSimilares, setTurnosSimilares] = React.useState<TurnoData[]>([]);
  const [loadingSimilares, setLoadingSimilares] = React.useState(false);
  const [errorSimilares, setErrorSimilares] = React.useState<string | null>(null);
  const [loadingInscripcion, setLoadingInscripcion] = React.useState(false);
  const [errorCancelar, setErrorCancelar] = React.useState<string | null>(null);
  const [loadingCancelacion, setLoadingCancelacion] = React.useState(false);
  const [estaInscripto, setEstaInscripto] = React.useState(false);
  const [mostrarModalConfirmacionCancelacion, setMostrarModalConfirmacionCancelacion] = React.useState(false);
  const [loadingConfirmacion, setLoadingConfirmacion] = React.useState(false);
  const [datosReembolso, setDatosReembolso] = React.useState<reembolsoDTO | null>(null);
  
  const abrirPopUpReprogramar = async () => {
    if (!user?.id) return;
    setMostrarPopUpReprogramar(true);
    setLoadingSimilares(true);
    setErrorSimilares(null);
    try {
      const data =  await getTurnosSimilares(id, user.id);
      setTurnosSimilares(data || []);
    } catch {
      setErrorSimilares("Error al cargar los turnos similares");
    } finally {
      setLoadingSimilares(false);
    }
  }
const modalReprogramar = mostrarPopUpReprogramar && createPortal(
    <div className="modal-overlay">
        <div className="modal-card modal-reprogramar-container">
            <h2>Turnos similares disponibles</h2>
            <p>Elegí un turno para reprogramar tu inscripción.</p>
            {loadingSimilares && (
                <p><span className="button-spinner" aria-hidden="true" /> Buscando turnos similares...</p>
            )}
            {!loadingSimilares && errorSimilares && <p>{errorSimilares}</p>}
            {!loadingSimilares && !errorSimilares && turnosSimilares.length === 0 && (
                <p>No se encontraron turnos similares disponibles.</p>
            )}

            {!loadingSimilares && !errorSimilares && turnosSimilares.length > 0 && (
                <div className="grilla-opciones">
                    {turnosSimilares.map((turnoSimilar) => (
                        <div className="tarjeta-opcion" key={turnoSimilar.id}>
                            <div className="tarjeta-header">
                                <h3 className="tarjeta-titulo">Día: {formatearDiaEnEspanol(turnoSimilar.dia)}</h3>
                                <div className="tarjeta-subtitulo">Fecha: {formatearFechaEnEspanol(turnoSimilar.fecha)}</div>
                            </div>
                            
                            <div className="tarjeta-info">
                                <p><strong>Fecha:</strong> <span>{formatearFechaEnEspanol(turnoSimilar.fecha)}</span></p>
                                <p><strong>Hora:</strong> <span>{turnoSimilar.hora}</span></p>
                                <p><strong>Cupo:</strong> <span>{turnoSimilar.cantidadDePacientesActuales}/{turnoSimilar.cupoMaxPacientes}</span></p>
                            </div>

                            <button
                                className="btn-elegir-tarjeta"
                                onClick={async () => {
                                    if (!user?.id) return;
                                    await reprogramarTurno(user.id, id, turnoSimilar.id);
                                    toast.success("Turno reprogramado con éxito");
                                    setMostrarPopUpReprogramar(false);
                                    onReprogramar?.();
                                }}
                            >
                                Elegir este turno
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div className="modal-actions">
                <button className="btn-log" onClick={() => setMostrarPopUpReprogramar(false)}>
                    Cerrar
                </button>
            </div>
        </div>
    </div>,
    document.body  
);
    // Verificar si el usuario esta inscripto.
    useEffect(() => {
      if (!user?.id) return;
        estaInscriptoEnTurno(user.id,id)
          .then(setEstaInscripto)
          .catch(err => console.error("Error al verificar inscripcion: ", err));
      },[user?.id,id]);
    const handleIniciarCancelacion = async() => {
      if (!user?.id) return;
      setLoadingConfirmacion(true);
      
      setErrorCancelar(null);
      try {
        const respuestaReembolso = await calcularReembolso(user.id,id);
        setDatosReembolso(respuestaReembolso);

        if (!respuestaReembolso.permitido) {
          setErrorCancelar(String(respuestaReembolso.mensaje) || "Error desconocido");
        } else {
          setMostrarModalConfirmacionCancelacion(true);
        }
      } catch (error) {
        setErrorCancelar("Error al calcular el reembolso");
      } finally {
        setLoadingConfirmacion(false);
      }
    }
    const handleConfirmarCancelacion = async () => {
        if (!user?.id) return;
        setLoadingCancelacion(true);
        setErrorCancelar(null);
        try {
          await cancelarTurno(user.id,id);
          setEstaInscripto(false);
          setMostrarModalConfirmacionCancelacion(false);
          onCancelar();
          toast.success("Turno cancelado con éxito");
          setDatosReembolso(null);
        } catch {
          setErrorCancelar("Error al cancelar el turno");
        } finally {
          setLoadingInscripcion(false);
        }
      }
      const handleAgregarACola = async (rutinaId: number) => {
          if (!user?.id) return;
          try {
              await agregarAColaEspera(rutinaId, user.id);
              toast.success("Te anotaste a la cola de espera");
          } catch (e: any) {
              toast.error(e?.message || "Error al agregar a la cola de espera");
          }
      };
  const modalConfirmacionCancelacion = mostrarModalConfirmacionCancelacion &&
  datosReembolso &&
  createPortal(
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Confirmar cancelación</h2>

        <p>
          <strong>Costo del turno:</strong> ${datosReembolso.costoOriginal.toFixed(2)}
        </p>

        <p>
          <strong>Reembolso:</strong>{" "}
          <span
            style={{
              color:
                (datosReembolso.monto / datosReembolso.costoOriginal) * 100 === 100
                  ? "#10b981"
                  : (datosReembolso.monto / datosReembolso.costoOriginal) * 100 === 50
                    ? "#f59e0b"
                    : "#ef4444",
              fontWeight: "bold",
            }}
          >
            ${datosReembolso.monto.toFixed(2)} (
            {((datosReembolso.monto / datosReembolso.costoOriginal) * 100).toFixed(0)}%)
          </span>
        </p>

        <p style={{ fontSize: "13px", color: "var(--color-muted)" }}>
          {datosReembolso.mensaje}
        </p>

        <div className="modal-actions">
          <button
            className="btn-log"
            onClick={() => setMostrarModalConfirmacionCancelacion(false)}
            disabled={loadingInscripcion}
          >
            Volver atrás
          </button>
          <button
            className="btn-log"
            onClick={handleConfirmarCancelacion }
            disabled={loadingCancelacion}
          >
            {loadingCancelacion ? "Procesando..." : "Aceptar cancelación"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
if (modo === "misTurnos") { return ( 
  <>
    <div className="acciones-usuario-container">
        <button className="btn-accion-azul btn-accion-outline" onClick={handleIniciarCancelacion}>
            {errorCancelar && <span style={{ color: 'red', marginRight: '8px' }}>{errorCancelar}</span>}
            {loadingInscripcion ? "Cancelando..." : "Cancelar turno"}
        </button>
        <button className="btn-accion-azul" onClick={abrirPopUpReprogramar}>
            Reprogramar turno
        </button>
    </div>
    {modalReprogramar}
    {modalConfirmacionCancelacion}
  </>
)};
      const renderSkeletons = () => (
        <div className="activity-skeleton-grid" aria-label="Cargando">
            {Array.from({ length: 3 }).map((_, index) => (
                <div className="activity-card-skeleton" key={index} />
            ))}
        </div>
    );
  if (turnoLleno) { return  renderSkeletons() ? (
    <>
      <div className="card-container">
            <button className="btn-log" onClick={() => handleAgregarACola(id)}>
              Anotarme a cola de espera
            </button>
        </div>
    </>
  ) : (
    <p className="activity-empty">No hay turnos disponibles por ahora.</p>
  )};
  if (!usuarioLogueado) return <button className='btn-log' onClick={onLogin}>Agendar turno</button>
  if (!estaInscripto) return <button className="btn-log" onClick={onAgendar}>Agendar turno</button>
    else
        return <button className='btn-log' disabled>Estas incripto</button>

}
