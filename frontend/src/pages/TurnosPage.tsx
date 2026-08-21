import { useEffect, useState } from "react";
import type { TurnoData } from "../constants/shift";
import { Turno } from "../components/Turno";
import "./RutinasYTurnos.css";
import { getTurnos } from "../services/turnoService";
const pageContent = {
    eyebrow: "Turnos",
    title: "Reserva el horario que mejor te queda",
    description: "Consulta la disponibilidad actual y agenda tu proximo turno en pocos pasos.",
};

export function TurnosPage() {
    const [turnos, setTurnos] = useState<TurnoData[]>([]);
    const [errorTurno, setErrorTurno] = useState<string | null>(null);
    const [loadingTurnos, setLoadingTurnos] = useState(true);

    
    useEffect(() => {
        let ignore = false;
        const cargarTurnos = async () => {
            setLoadingTurnos(true);
            setErrorTurno(null);
            try {
                const data = await getTurnos();
            if (!ignore) setTurnos(data);
            } catch (error) {
            if (!ignore) setErrorTurno("Error al obtener los turnos: " + error);
            } finally {
            if (!ignore) setLoadingTurnos(false);
        }
    };
    cargarTurnos();
    return () => {ignore = true;}    
    }, []    
    );


    const renderSkeletons = () => (
        <div className="activity-skeleton-grid" aria-label="Cargando">
            {Array.from({ length: 3 }).map((_, index) => (
                <div className="activity-card-skeleton" key={index} />
            ))}
        </div>
    );

    return (
        <div className="activities-page">
            <section className="activities-hero">
                <div className="activities-hero-copy">
                    <p className="activities-eyebrow">{pageContent.eyebrow}</p>
                    <h1>{pageContent.title}</h1>
                    <p>{pageContent.description}</p>
                </div>
            </section>

            <section className="activity-section" aria-labelledby="turnos-title">
                <div className="activity-section-header">
                    <div>
                        <p className="activity-kicker">Agenda</p>
                        <h2 id="turnos-title">Turnos disponibles</h2>
                    </div>
                    <span className="activity-count">
                        {loadingTurnos ? "Cargando" : `${turnos.length} resultados`}
                    </span>
                </div>

                {errorTurno && <p className="activity-error">{errorTurno}</p>}
                {loadingTurnos ? renderSkeletons() : turnos.length > 0 ? (
                    <div className="card-container">
                        {turnos.map((turno) => (
                            <Turno key={turno.id} turnoRecibido={turno} />
                        ))}
                    </div>
                ) : (
                    <p className="activity-empty">No hay turnos disponibles por ahora.</p>
                )}
            </section>
        </div>
    );
}
