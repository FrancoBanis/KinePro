import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { ProfesionalData, TurnoData } from "../constants/shift";
import { getAllTurnos, getProfesionales, getRutina } from "../services/turnoService";
import { formatearDiaEnEspanol, formatearFechaEnEspanol } from "../utils/formateador";
import "./RutinasYTurnos.css";

interface TurnoConRutina extends TurnoData {
    rutinaNombre?: string;
}

export function HistorialTurnosPage() {
    const { user } = useAuth();
    const [turnos, setTurnos] = useState<TurnoConRutina[]>([]);
    const [profesionales, setProfesionales] = useState<ProfesionalData[]>([]);
    const [profesionalFiltro, setProfesionalFiltro] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;
        const cargarDatos = async () => {
            setLoading(true);
            setError(null);
            try {
                const [data, profs] = await Promise.all([
                    getAllTurnos(),
                    getProfesionales(),
                ]);
                const conRutina = await Promise.all(
                    (data as TurnoData[]).map(async (t) => {
                        let rutinaNombre: string | undefined;
                        if (t.id_rutina) {
                            try {
                                const r = await getRutina(t.id_rutina);
                                rutinaNombre = r.nombre;
                            } catch {
                                rutinaNombre = "Rutina desconocida";
                            }
                        }
                        return { ...t, rutinaNombre };
                    })
                );
                if (!ignore) {
                    setTurnos(conRutina);
                    setProfesionales(profs);
                }
            } catch (err) {
                if (!ignore) setError("Error al obtener los turnos: " + err);
            } finally {
                if (!ignore) setLoading(false);
            }
        };
        cargarDatos();
        return () => { ignore = true; }
    }, []);

    const esAdmin = user?.rol === 'ROLE_ADMIN';

    const turnosFiltrados = turnos
        .filter((t) => {
            if (!profesionalFiltro) return true;
            return t.profesionales?.some((p) => p.id.toString() === profesionalFiltro);
        })
        .sort((a, b) => {
            if (a.activa !== b.activa) return a.activa === false ? 1 : -1;
            return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        });

    if (!esAdmin) {
        return (
            <div className="activities-page">
                <section className="activities-hero">
                    <div className="activities-hero-copy">
                        <p className="activities-eyebrow">Historial</p>
                        <h1>Historial de turnos</h1>
                        <p>Esta página está disponible solo para administradores.</p>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="activities-page">
            <section className="activities-hero">
                <div className="activities-hero-copy">
                    <p className="activities-eyebrow">Historial</p>
                    <h1>Historial de turnos</h1>
                    <p>Visualizá todos los turnos de la clínica, incluyendo los inactivos.</p>
                </div>
            </section>

            <section className="activity-section" aria-labelledby="historial-title">
                <div className="activity-section-header">
                    <div>
                        <p className="activity-kicker">Turnos</p>
                        <h2 id="historial-title">Todos los turnos</h2>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <select
                            className="historial-filtro-select"
                            value={profesionalFiltro}
                            onChange={(e) => setProfesionalFiltro(e.target.value)}
                        >
                            <option value="">Todos los profesionales</option>
                            {profesionales.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre} {p.apellido}
                                </option>
                            ))}
                        </select>
                        <span className="activity-count">
                            {loading ? "Cargando" : `${turnosFiltrados.length} resultados`}
                        </span>
                    </div>
                </div>

                {error && <p className="activity-error">{error}</p>}
                {loading ? (
                    <div className="activity-skeleton-grid" aria-label="Cargando">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div className="activity-card-skeleton" key={i} />
                        ))}
                    </div>
                ) : turnosFiltrados.length > 0 ? (
                    <div className="historial-card-list">
                        {turnosFiltrados.map((turno) => (
                            <div
                                key={turno.id}
                                className={`historial-card-row ${turno.activa === false ? "historial-card-row--inactive" : ""}`}
                            >
                                {turno.rutinaNombre && (
                                    <h3 className="historial-card-row-title">{turno.rutinaNombre}</h3>
                                )}
                                <div className="historial-card-row-info">
                                    <p><strong>Día:</strong> {formatearDiaEnEspanol(turno.dia)}</p>
                                    <p><strong>Fecha:</strong> {formatearFechaEnEspanol(turno.fecha)}</p>
                                    <p><strong>Hora:</strong> {turno.hora}</p>
                                    <p><strong>Pacientes:</strong> {turno.cantidadDePacientesActuales ?? 0} / {turno.cupoMaxPacientes}</p>
                                    <p>
                                        <strong>Estado:</strong>{" "}
                                        <span
                                            style={{
                                                fontWeight: 700,
                                                color: turno.activa === false ? "#dc3545" : "#198754",
                                            }}
                                        >
                                            {turno.activa === false ? "Inactivo" : "Activo"}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="activity-empty">No se encontraron turnos.</p>
                )}
            </section>
        </div>
    );
}

export default HistorialTurnosPage;
