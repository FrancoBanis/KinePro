import React, { useEffect, useState } from "react";
import type { TurnoData } from "../constants/turno";
import "./BotonesUsuario.css";
import { useAuth } from "../context/AuthContext";
import { 
    calcularReembolso, 
    cancelarTurno, 
    estaInscriptoEnTurno, 
    getTurnosSimilares, 
    reprogramarTurno, 
    agregarAColaEspera,} from "../services/turnoService";
import { formatearDiaEnEspanol, formatearFechaEnEspanol } from "../utils/formateador";
import { createPortal } from "react-dom";
import type { reembolsoDTO } from "../constants/reembolso";
import { toast } from "sonner";
import { estaEnColaDeEspera } from "../services/colaTurnoService";

type Modo = "publico" | "misTurnos";

interface Props {
    modo: Modo;
    id: number;
    turnoLleno: boolean;
    usuarioLogueado: boolean;
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
}: Props) {
    const { user } = useAuth();
    const [mostrarPopUpReprogramar, setMostrarPopUpReprogramar] = useState(false);
    const [turnosSimilares, setTurnosSimilares] = useState<TurnoData[]>([]);
    const [loadingSimilares, setLoadingSimilares] = useState(false);
    const [errorSimilares, setErrorSimilares] = useState<string | null>(null);
    const [loadingInscripcion, setLoadingInscripcion] = useState(false);
    const [errorCancelar, setErrorCancelar] = useState<string | null>(null);
    const [loadingCancelacion, setLoadingCancelacion] = useState(false);

    const [estaInscripto, setEstaInscripto] = useState(false);
    const [yaEnCola, setYaEnCola] = useState(false);
    const [loadingVerificacion, setLoadingVerificacion] = useState(true);
    
    const [mostrarModalConfirmacionCancelacion, setMostrarModalConfirmacionCancelacion] = useState(false);
    const [loadingConfirmacion, setLoadingConfirmacion] = useState(false);
    const [datosReembolso, setDatosReembolso] = useState<reembolsoDTO | null>(null);
    
    // Estado de acción de cola
    const [loadingCola, setLoadingCola] = useState(false);

    useEffect(() => {
        if (!user?.id) {
            setLoadingVerificacion(false);
            return;
        }

        setLoadingVerificacion(true);

        Promise.all([
            estaInscriptoEnTurno(user.id, id),
            estaEnColaDeEspera(id, user.id)
        ])
            .then(([inscripto, enCola]) => {
                setEstaInscripto(inscripto);
                setYaEnCola(enCola);
            })
            .catch((err) => console.error("Error al verificar estado del turno: ", err))
            .finally(() => setLoadingVerificacion(false));
    }, [user?.id, id]);

    const abrirPopUpReprogramar = async () => {
        if (!user?.id) return;
        setMostrarPopUpReprogramar(true);
        setLoadingSimilares(true);
        setErrorSimilares(null);
        try {
            const data = await getTurnosSimilares(id, user.id);
            setTurnosSimilares(data || []);
        } catch {
            setErrorSimilares("Error al cargar los turnos similares");
        } finally {
            setLoadingSimilares(false);
        }
    };

    const handleIniciarCancelacion = async () => {
        if (!user?.id) return;
        setLoadingConfirmacion(true);
        setErrorCancelar(null);
        try {
            const respuestaReembolso = await calcularReembolso(user.id, id);
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
    };

    const handleConfirmarCancelacion = async () => {
        if (!user?.id) return;
        setLoadingCancelacion(true);
        setErrorCancelar(null);
        try {
            await cancelarTurno(user.id, id);
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
    };

    const handleAgregarACola = async () => {
        if (!user?.id) return;
        setLoadingCola(true);
        try {
            await agregarAColaEspera(id, user.id);
            setYaEnCola(true);
            toast.success("¡Te anotaste exitosamente a la cola de espera!");
        } catch (e: any) {
            let mensajeError = "Error al agregar a la cola de espera";
            try {
                const parsed = typeof e?.message === "string" ? JSON.parse(e.message) : e;
                mensajeError = parsed?.message || e?.message || mensajeError;
            } catch {
                mensajeError = e?.message || mensajeError;
            }

            if (mensajeError.includes("ya está en la cola")) {
                setYaEnCola(true);
            }

            toast.error(mensajeError);
        } finally {
            setLoadingCola(false);
        }
    };

    const modalReprogramar = mostrarPopUpReprogramar && createPortal(
        <div className="modal-overlay">
            <div className="modal-card modal-reprogramar-container">
                <h2>Turnos similares disponibles</h2>
                <p>Elegí un turno para reprogramar tu inscripción.</p>
                {loadingSimilares && <p>Buscando turnos similares...</p>}
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
                                    <div className="tarjeta-subtitulo">Hora: {turnoSimilar.hora}</div>
                                </div>
                                <div className="tarjeta-info">
                                    <p><strong>Cupo:</strong> <span>{turnoSimilar.cantidadDePacientesActuales}/{turnoSimilar.cupoMaxPacientes}</span></p>
                                </div>
                                <button
    className="btn-elegir-tarjeta"
    onClick={async () => {
        if (!user?.id) return;
        try {
            await reprogramarTurno(user.id, id, turnoSimilar.id);
            toast.success("Turno reprogramado con éxito");
            setMostrarPopUpReprogramar(false);
            onReprogramar?.();
        } catch (error: any) {
            console.error("Error al reprogramar turno:", error);
            toast.error("Ocurrió un error al reprogramar el turno");
            // Opcional: Si querés forzar el cierre y refresco aunque falle la respuesta de la API:
            setMostrarPopUpReprogramar(false);
            onReprogramar?.();
        }
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

    const modalConfirmacionCancelacion = mostrarModalConfirmacionCancelacion && datosReembolso && createPortal(
        <div className="modal-overlay">
            <div className="modal-card">
                <h2>Confirmar cancelación</h2>
                <p><strong>Costo del turno:</strong> ${datosReembolso.costoOriginal.toFixed(2)}</p>
                <p>
                    <strong>Reembolso:</strong>{" "}
                    <span style={{ color: (datosReembolso.monto / datosReembolso.costoOriginal) * 100 === 100 ? "#10b981" : "#f59e0b", fontWeight: "bold" }}>
                        ${datosReembolso.monto.toFixed(2)}
                    </span>
                </p>
                <div className="modal-actions">
                    <button className="btn-log" onClick={() => setMostrarModalConfirmacionCancelacion(false)}>
                        Volver atrás
                    </button>
                    <button className="btn-log" onClick={handleConfirmarCancelacion} disabled={loadingCancelacion}>
                        {loadingCancelacion ? "Procesando..." : "Aceptar cancelación"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );

    if (modo === "misTurnos") { 
        return ( 
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
        );
    }

    // --- MODO PÚBLICO ---

    if (!usuarioLogueado) {
        return <button className="btn-log" onClick={onLogin}>Agendar turno</button>;
    }

    // Mientras consulta la API evita cualquier salto/parpadeo de interfaz
    if (loadingVerificacion) {
        return <button className="btn-log" disabled style={{ opacity: 0.6 }}>Cargando...</button>;
    }


    if (estaInscripto) {
        return <button className="btn-log" disabled style={{ backgroundColor: '#e2e8f0', color: '#64748b', border: 'none' }}>Estás inscripto</button>;
    }

    if (turnoLleno) {
        return (
            <button 
                className={yaEnCola ? "btn-disabled" : "btn-log"} 
                onClick={handleAgregarACola}
                disabled={yaEnCola || loadingCola}
                style={yaEnCola ? { 
                    backgroundColor: '#e2e8f0', 
                    color: '#64748b', 
                    border: 'none', 
                    cursor: 'not-allowed',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontWeight: '600'
                } : {}}
            >
                {loadingCola 
                    ? "Cargando..." 
                    : yaEnCola 
                    ? "Ya estás en cola de espera" 
                    : "Anotarme a cola de espera"}
            </button>
        );
    }

  
    return (
        <button className="btn-log" onClick={onAgendar}>
            Agendar turno
        </button>
    );
}