import React, { useEffect } from "react";
import { useState } from "react";
import { getCantidadDeMisRutinas, getCantidadDeRutinas, getRutinasSimilares, reprogramarRutina } from "../services/rutinaService";
import { useAuth } from "../context/AuthContext";
import type { RutinaData } from "../constants/rutina";
import type { TurnoData } from "../constants/turno";
import type { reembolsoDTO } from "../constants/reembolso";
import { getTurnosSimilares, calcularReembolso } from "../services/turnoService";
import { formatearDiaEnEspanol, formatearFechaEnEspanol } from "../utils/formateador";
import { createPortal } from "react-dom";
import { toast } from "sonner";

type modo = 'publico' | 'misTurnos';
type DetalleReembolsoTurno = { turno: TurnoData; reembolso: reembolsoDTO };

interface Props {
    modo : modo;
    estaInscripto: Boolean;
    rutinaLlena: Boolean;
    usuarioLogueado: Boolean;
    loadingInscripcion: Boolean;
    id : number;
    turnos?: TurnoData[];
    onCancelar: () => void;
    onAgendar: () => void;
    onLogin: () => void;
    onReprogramarRutina?: () => void;
}


export function BotonesUsuarioRutina({
    modo,
    estaInscripto,
    rutinaLlena,
    usuarioLogueado,
    loadingInscripcion,
    id,
    turnos,
    onCancelar,
    onAgendar,
    onLogin,
    onReprogramarRutina
} :  Props) {
    const { user } = useAuth();
    const [loadingContador, setLoadingContador] = useState<boolean>(true);
    const [contadorRutinas,setContadorRutinas] = React.useState<number | null>(0);
    const [mostrarPopUpReprogramar, setMostrarPopUpReprogramar] = React.useState(false);
    const [rutinasSimilares, setRutinasSimilares] = React.useState<RutinaData[]>([]);
    const [loadingSimilares, setLoadingSimilares] = React.useState(false);
    const [errorSimilares, setErrorSimilares] = React.useState<string | null>(null);
    const [loadingReprogramar, setLoadingReprogramar] = React.useState(false);
    const [errorReprogramar, setErrorReprogramar] = React.useState<string | null>(null);
    const [errorCancelarRutina, setErrorCancelarRutina] = React.useState<string | null>(null);
    const [loadingConfirmacionRutina, setLoadingConfirmacionRutina] = React.useState(false);
    const [mostrarModalConfirmacionCancelacionRutina, setMostrarModalConfirmacionCancelacionRutina] = React.useState(false);
    const [detalleReembolsoRutina, setDetalleReembolsoRutina] = React.useState<DetalleReembolsoTurno[] | null>(null);
    const abrirPopUpReprogramar = async() => {
        if (!user?.id) return;
        setMostrarPopUpReprogramar(true);
        setLoadingSimilares(true);
        setErrorSimilares(null);
        setErrorReprogramar(null);
        try {
            const data = await getRutinasSimilares(id, user.id);
            setRutinasSimilares(data || []);
        } catch {
            toast.error("Error al cargar las rutinas similares");
        } finally {
            setLoadingSimilares(false);
        }
    }
    const handleReprogramar = async (rutinaNuevaId: number) => {
        if (!user?.id) return;
        setLoadingReprogramar(true);
        setErrorReprogramar(null);
        try {
            await reprogramarRutina(user.id, id, rutinaNuevaId);
            toast.success("¡Rutina reprogramada con éxito!");
            setMostrarPopUpReprogramar(false);
            onReprogramarRutina?.();
        } catch (err: any) {
            setErrorReprogramar(err?.message || "Ocurrió un error al reprogramar.");
            toast.error("Error al reprogramar la rutina:" + err?.meesage);
        } finally {
            setLoadingReprogramar(false);
        }
    };
const modalReprogramar = mostrarPopUpReprogramar && createPortal(
    <div className="modal-overlay">
        <div className="modal-card modal-reprogramar-container">
            <h2>Rutinas similares disponibles</h2>
            <p>Elegí una rutina similar para reprogramar tu inscripción completa.</p>
            
            {loadingSimilares && (
                <p><span className="button-spinner" aria-hidden="true" /> Buscando opciones similares...</p>
            )}
            {!loadingSimilares && errorSimilares && <p>{errorSimilares}</p>}
            {errorReprogramar && <p style={{ color: "red", fontWeight: "bold" }}>{errorReprogramar}</p>}
            
            {!loadingSimilares && !errorSimilares && rutinasSimilares.length === 0 && (
                <p>No se encontraron rutinas similares disponibles con turnos libres.</p>
            )}

            {!loadingSimilares && !errorSimilares && rutinasSimilares.length > 0 && (
                <div className="grilla-opciones">
                    {rutinasSimilares.map((rutinaSimilar) => (
                        <div className="tarjeta-opcion" key={rutinaSimilar.id}>
                            <div className="tarjeta-header">
                                <h3 className="tarjeta-titulo">{rutinaSimilar.nombre}</h3>
                                <div className="tarjeta-subtitulo">Inicio: {rutinaSimilar.fechaDeInicio}</div>
                            </div>
                            
                            <div className="tarjeta-info">
                                <p><strong>Profesionales:</strong> <span>{rutinaSimilar.nombresDeProfesionales}</span></p>
                                <p><strong>Tipo:</strong> <span>{rutinaSimilar.tipo?.nombre}</span></p>
                                <p><strong>Fin:</strong> <span>{rutinaSimilar.fechaDeFin}</span></p>
                                <p><strong>Costo:</strong> <span>${rutinaSimilar.costoPorTurno}</span></p>
                                <p><strong>Cupo max:</strong> <span>{rutinaSimilar.capacidadMaxima}</span></p>
                            </div>

                            <button
                                className="btn-elegir-tarjeta"
                                onClick={() => handleReprogramar(rutinaSimilar.id)}
                                disabled={loadingReprogramar}
                            >
                                {loadingReprogramar ? "Procesando..." : "Elegir esta rutina"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div className="modal-actions">
                <button className="btn-log" onClick={() => setMostrarPopUpReprogramar(false)} disabled={loadingReprogramar}>
                    Cerrar
                </button>
            </div>
        </div>
    </div>,
    document.body
);
    const handleIniciarCancelacionRutina = async () => {
        if (!user?.id) return;
        const turnosDeLaRutina = turnos ?? [];
        if (turnosDeLaRutina.length === 0) {
            onCancelar();
            return;
        }
        setLoadingConfirmacionRutina(true);
        setErrorCancelarRutina(null);
        try {
            const resultados = await Promise.all(
                turnosDeLaRutina.map((t) => calcularReembolso(user.id!, t.id))
            );
            const noPermitido = resultados.find((r) => !r.permitido);
            if (noPermitido) {
                setErrorCancelarRutina(String(noPermitido.mensaje) || "No se puede cancelar la rutina.");
                return;
            }
            const detalle = turnosDeLaRutina.map((t, i) => ({ turno: t, reembolso: resultados[i] }));
            setDetalleReembolsoRutina(detalle);
            setMostrarModalConfirmacionCancelacionRutina(true);
        } catch {
            setErrorCancelarRutina("Error al calcular el reembolso");
        } finally {
            setLoadingConfirmacionRutina(false);
        }
    };
    const handleConfirmarCancelacionRutina = async () => {
        setMostrarModalConfirmacionCancelacionRutina(false);
        setDetalleReembolsoRutina(null);
        onCancelar();
    };
    const colorSegunPorcentaje = (pct: number) =>
        pct === 100 ? "#10b981" : pct === 50 ? "#f59e0b" : "#ef4444";
    const modalConfirmacionCancelacionRutina = mostrarModalConfirmacionCancelacionRutina &&
      detalleReembolsoRutina &&
      (() => {
        const costoTotal = detalleReembolsoRutina.reduce((acc, d) => acc + d.reembolso.costoOriginal, 0);
        const montoTotal = detalleReembolsoRutina.reduce((acc, d) => acc + d.reembolso.monto, 0);
        const pctTotal = costoTotal > 0 ? (montoTotal / costoTotal) * 100 : 0;
        return createPortal(
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Confirmar cancelación</h2>

            {detalleReembolsoRutina.map(({ turno, reembolso }) => {
              const pct = reembolso.costoOriginal > 0 ? (reembolso.monto / reembolso.costoOriginal) * 100 : 0;
              return (
                <p key={turno.id}>
                  <strong>{formatearDiaEnEspanol(turno.dia)} {formatearFechaEnEspanol(turno.fecha)}:</strong>{" "}
                  <span style={{ color: colorSegunPorcentaje(pct), fontWeight: "bold" }}>
                    ${reembolso.monto.toFixed(2)} ({pct.toFixed(0)}%)
                  </span>
                  {" "}de ${reembolso.costoOriginal.toFixed(2)}
                </p>
              );
            })}

            <hr />

            <p>
              <strong>Total a reembolsar:</strong>{" "}
              <span style={{ color: colorSegunPorcentaje(pctTotal), fontWeight: "bold" }}>
                ${montoTotal.toFixed(2)} ({pctTotal.toFixed(0)}%)
              </span>
              {" "}de ${costoTotal.toFixed(2)}
            </p>

            <div className="modal-actions">
              <button
                className="btn-log"
                onClick={() => setMostrarModalConfirmacionCancelacionRutina(false)}
                disabled={!!loadingInscripcion}
              >
                Volver atrás
              </button>
              <button
                className="btn-log"
                onClick={handleConfirmarCancelacionRutina}
                disabled={!!loadingInscripcion}
              >
                {loadingInscripcion ? "Procesando..." : "Aceptar cancelación"}
              </button>
            </div>
          </div>
        </div>,
        document.body
        );
      })();
    useEffect(() => {
        const fetchCantidad = async () => {
            if (!user?.id) { 
                setLoadingContador(false);
                return;
            }
            try {
                const response = await getCantidadDeRutinas(id, user.id);
                setContadorRutinas(response);
            } catch(error) {
                console.error(error);
            } finally {
                setLoadingContador(false);
            }
        };

        fetchCantidad();
    }, [id, user?.id]);
if (modo === 'misTurnos') {
    if (!estaInscripto) {
        return null;
    }
    return (
    <>
      <div className="acciones-usuario-container">
          <button className="btn-accion-azul btn-accion-outline" onClick={handleIniciarCancelacionRutina} disabled={loadingConfirmacionRutina}>
            {loadingConfirmacionRutina ? "Calculando..." : loadingInscripcion ? "Cancelando..." : "Cancelar rutina"}
          </button>
          
          <button className="btn-accion-azul" onClick={abrirPopUpReprogramar}>
            Reprogramar rutina
          </button>
      </div>
      {errorCancelarRutina && <p style={{ color: 'red', marginTop: '4px' }}>{errorCancelarRutina}</p>}
      {modalReprogramar}
      {modalConfirmacionCancelacionRutina}
    </>
    )
};
        if (estaInscripto) {
            return <button className="btn-log" disabled>Ya inscripto</button>
        }
    if (rutinaLlena) {
        return <button className="btn-log" disabled>Rutina llena</button>
    }
        if (!usuarioLogueado) {
             return <button className='btn-log' onClick={onLogin}>Agendar rutina</button>
        }
        if (loadingContador) {
        return <button className="btn-log" disabled>Cargando disponibilidad...</button>;
        }
        if (contadorRutinas !== null && contadorRutinas > 0) {
            return <button className="btn-log" onClick={onAgendar}>
            Agendar rutina
            </button>
        }
        return <button className="btn-log" disabled>Sin turnos disponibles</button>

}