import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RutinaData } from "../constants/rutina";
import { Rutina } from "../components/Rutina";
import RutinaFormModal, { type RutinaFormValues } from "../components/forms/RutinaFormModal";
import { useAuth } from "../context/AuthContext";
import "./RutinasYTurnos.css";
import { getRutinasActivas, handleCrearRutina, handleModificarRutina } from "../services/rutinaService";

// IMPORTAMOS TU NUEVO SERVICIO DE COLA DE RUTINAS
import { agregarAColaRutina, estaEnColaRutina } from "../services/colaRutinaService"; 

const pageContent = {
    eyebrow: "Rutinas",
    title: "Elegí la rutina que acompaña tu objetivo",
    description:
        "Programas organizados por profesionales, fechas y cupos para que puedas elegir con claridad.",
};

export function RutinasPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const puedeEditarRutinas =
        user?.rol?.toString() === "ROLE_ADMIN" || user?.rol?.toString() === "ROLE_SECRETARIA";

    const [rutinas, setRutinas] = useState<RutinaData[]>([]);
    const [errorRutina, setErrorRutina] = useState<string | null>(null);
    const [loadingRutinas, setLoadingRutinas] = useState(true);
    const [openForm, setOpenForm] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [rutinaEnEdicion, setRutinaEnEdicion] = useState<RutinaData | null>(null);
    
    // Estado dinámico para saber en qué rutinas ya está anotado en cola el usuario
    const [colasEspera, setColasEspera] = useState<Record<number, boolean>>({});
    
    const cargarRutinas = async (ignore = false) => {
        setLoadingRutinas(true);
        setErrorRutina(null);

        try {
            const response = await getRutinasActivas();
            const data = await response;
            const onlyActive = (data || []).map((r: any) => ({
                ...r,
                turno: (r.turno || []).filter((t: any) => t.activa),
            }));

            if (!ignore) {
                setRutinas(onlyActive);
            }
        } catch (error) {
            if (!ignore) setErrorRutina("Error al obtener las rutinas: " + error);
        } finally {
            if (!ignore) setLoadingRutinas(false);
        }
    };
    const handleDesactivarRutina = () => {
        cargarRutinas();
    };
    // Función para verificar si el usuario logueado ya está en la cola de las rutinas llenas
    const verificarColasEspera = async (rutinasCargadas: RutinaData[]) => {
        if (!user?.id) return;
        const nuevoEstadoColas: Record<number, boolean> = {};

        // Filtramos las rutinas que están llenas y en las que el usuario no está inscripto
        const rutinasLlenasYNoInscripto = rutinasCargadas.filter((rutina) => {
            const turnosActivos = (rutina.turnos || []).filter((t: any) => t.activa !== false);
            
            // Criterios de Rutina Llena (alineado con Rutina.tsx)
            const cupoMaximoAlcanzado = (rutina.cantidadPacientesRutina ?? 0) >= (rutina.cupoMaxRutina ?? Infinity);
            const todosTurnosLlenos = turnosActivos.length > 0 && turnosActivos.every(
                (t: any) => t.cantidadDePacientesActuales >= t.cupoMaxPacientes
            );
            const rutinaLlena = cupoMaximoAlcanzado || todosTurnosLlenos;

            // Verificación de Inscripción activa (para no verificar colas de algo donde ya estás)
            const estaInscripto = turnosActivos.some((t: any) => 
                (t.pacientesDesdeRutina ?? []).some((u: any) => u.id === user.id)
            );

            return rutinaLlena && !estaInscripto;
        });

        // Hacemos las consultas al backend en paralelo
        await Promise.all(
            rutinasLlenasYNoInscripto.map(async (rutina) => {
                try {
                    const enCola = await estaEnColaRutina(rutina.id, user.id!);
                    nuevoEstadoColas[rutina.id] = enCola;
                } catch (err) {
                    console.error(`Error al verificar estado de cola de rutina ${rutina.id}:`, err);
                }
            })
        );

        setColasEspera(nuevoEstadoColas);
    };

    useEffect(() => {
        let ignore = false;
        cargarRutinas(ignore);
        return () => {
            ignore = true;
        };
    }, []);

    // Cada vez que cambian las rutinas o el estado de autenticación del usuario, verificamos sus colas
    useEffect(() => {
        if (rutinas.length > 0 && user?.id) {
            verificarColasEspera(rutinas);
        }
    }, [rutinas, user?.id]);

    const abrirCrearRutina = () => {
        setRutinaEnEdicion(null);
        setFormMode("create");
        setOpenForm(true);
    };

    const abrirEditarRutina = (rutina: RutinaData) => {
        setRutinaEnEdicion(rutina);
        setFormMode("edit");
        setOpenForm(true);
    };

    const valoresIniciales: Partial<RutinaFormValues> | undefined = rutinaEnEdicion
        ? {
              nombre: rutinaEnEdicion.nombre,
              tipoRutinaId: rutinaEnEdicion.tipo?.id,
              nombresDeProfesionales: rutinaEnEdicion.nombresDeProfesionales,
              diaSemana: rutinaEnEdicion.diaSemana ?? "",
              fechaInicio: rutinaEnEdicion.fechaDeInicio,
              fechaFin: rutinaEnEdicion.fechaDeFin,
              horaInicio : rutinaEnEdicion.horaInicio,
              horaFin : rutinaEnEdicion.horaFin,
              costoPorTurno: rutinaEnEdicion.costoPorTurno,
              cupoMaxPacientesPorTurno: rutinaEnEdicion.capacidadMaxima,
              cupoMaxRutina: rutinaEnEdicion.cupoMaxRutina,
          }
        : undefined;

    // Actualizamos esta función para usar el nuevo servicio exclusivo de colas de rutina
    const handleAgregarACola = async (rutinaId: number) => {
        if (!user?.id) return;
        try {
            await agregarAColaRutina(rutinaId, user.id);
            
            // Actualizamos el estado local inmediatamente
            setColasEspera((prev) => ({ ...prev, [rutinaId]: true }));
            alert("¡Te anotaste exitosamente a la cola de espera de la rutina!");
        } catch (e: any) {
            alert(e?.message || "Error al agregar a la cola de espera");
        }
    };

    const handleSubmitRutina = async (values: RutinaFormValues) => {
            if (values.fechaInicio > values.fechaFin) {
                alert("La fecha de inicio debe ser anterior a la fecha de finalización");
            return;
        }
        const payload = {
            nombre: values.nombre,
            tipoRutinaId:  values.tipoRutinaId,
            nombresDeProfesionales: values.nombresDeProfesionales,
            diaSemana: values.diaSemana,
            fechaInicio: values.fechaInicio,
            fechaFin: values.fechaFin,
            horaInicio: values.horaInicio,
            horaFin: values.horaFin,
            cupoMaxPacientesPorTurno: values.cupoMaxPacientesPorTurno,
            cupoMaxRutina: values.cupoMaxRutina,
            costoPorTurno: values.costoPorTurno,
            activa : true,
        };

        if (formMode === "create") {
            try {
                await handleCrearRutina(payload);
                setOpenForm(false);
                setRutinaEnEdicion(null);
                await cargarRutinas();
                alert("Rutina creada exitosamente");
            } catch (error) {
                console.error(error);
                alert("Error al guardar la rutina");
            }

            return;
        }

       if (formMode === "edit" && rutinaEnEdicion) {
        try {
            const result = await handleModificarRutina(rutinaEnEdicion.id, payload);
            setOpenForm(false);
            setRutinaEnEdicion(null);
            await cargarRutinas();
            alert(result.message);
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Error desconocido";
            alert(msg);
        }
        return;
        }
    };

    const renderSkeletons = () => (
        <div className="activity-skeleton-grid" aria-label="Cargando">
            {Array.from({ length: 3 }).map((_, index) => (
                <div className="activity-card-skeleton" key={index} />
            ))}
        </div>
    );

    return (
        <div className="activities-page">
            {puedeEditarRutinas && (
                <RutinaFormModal
                    open={openForm}
                    onClose={() => setOpenForm(false)}
                    mode={formMode}
                    initialValues={valoresIniciales}
                    onSubmit={handleSubmitRutina}
                />
            )}

            <section className="activities-hero">
                <div className="activities-hero-copy">
                    <p className="activities-eyebrow">{pageContent.eyebrow}</p>
                    <h1>{pageContent.title}</h1>
                    <p>{pageContent.description}</p>
                </div>
            </section>

            <section className="activity-section" aria-labelledby="rutinas-title">
                <div className="activity-section-header">
                    <div>
                        <p className="activity-kicker">Programas</p>
                        <h2 id="rutinas-title">Rutinas disponibles</h2>
                    </div>
                    <span className="activity-count">
                        {loadingRutinas ? "Cargando" : `${rutinas.length} resultados`}
                    </span>
                </div>

                <div className="activities-admin">
                    <button
                        className="btn-secondary"
                        type="button"
                        onClick={() => navigate("/tipos-rutina")}
                    >
                        Ver tipos de rutina
                    </button>
                    {puedeEditarRutinas && (
                        <button className="btn-log" type="button" onClick={abrirCrearRutina}>
                            Crear rutina
                        </button>
                    )}
                </div>

                {errorRutina && <p className="activity-error">{errorRutina}</p>}
                {loadingRutinas ? renderSkeletons() : rutinas.length > 0 ? (
                    <div className="card-container">
                        {rutinas.map((rutina) => {
                            const turnosActivos = (rutina.turnos || []).filter((t: any) => t.activa !== false);
                            
                            // Determinamos de forma exacta si la rutina está llena
                            const cupoMaximoAlcanzado = (rutina.cantidadPacientesRutina ?? 0) >= (rutina.cupoMaxRutina ?? Infinity);
                            const todosTurnosLlenos = turnosActivos.length > 0 && turnosActivos.every(
                                (t: any) => t.cantidadDePacientesActuales >= t.cupoMaxPacientes
                            );
                            const rutinaLlena = cupoMaximoAlcanzado || todosTurnosLlenos;

                            // Verificamos si el usuario ya está inscripto
                            const estaInscripto = turnosActivos.some((t: any) => 
                                (t.pacientesDesdeRutina ?? []).some((u: any) => u.id === user?.id)
                            );

                            // Consultamos el estado de cola local para esta rutina
                            const yaEnCola = colasEspera[rutina.id] || false;

                            // Renderizamos el botón solo si la rutina está llena, el usuario está logueado y NO está inscripto
                            const accionCola = user && rutinaLlena && !estaInscripto ? (
                                <button 
                                    className="btn-log" 
                                    onClick={() => handleAgregarACola(rutina.id)}
                                    disabled={yaEnCola}
                                >
                                    {yaEnCola ? "Ya estás en cola de espera" : "Anotarme a cola de espera"}
                                </button>
                            ) : undefined;

                            return (
                                <Rutina
                                    key={rutina.id}
                                    rutinaRecibida={rutina}
                                    puedeEditar={puedeEditarRutinas}
                                    onEditar={() => abrirEditarRutina(rutina)}
                                    accionAdicional={accionCola}
                                    onRutinaDesactivada={handleDesactivarRutina}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <p className="activity-empty">No hay rutinas disponibles por ahora.</p>
                )}
            </section>
        </div>
    );
}

export default RutinasPage;
