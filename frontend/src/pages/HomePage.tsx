import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./HomePage.css";

interface NewsItem {
    id: number;
    title: string;
    category: string;
    date: string;
    description: string;
}

interface QuickAction {
    title: string;
    description: string;
    to: string;
    label: string;
}

const initialNews: NewsItem[] = [
    {
        id: 1,
        title: "Inauguramos nuevo espacio de atencion",
        category: "Recreativo",
        date: "21 May 2026",
        description: "Abrimos un espacio pensado para que cada paciente pueda entrenar, recuperarse y consultar con mayor comodidad.",
    },
    {
        id: 2,
        title: "Turnos y novedades del servicio",
        category: "Comunidad",
        date: "20 May 2026",
        description: "Vamos a publicar cambios de horarios, avisos importantes y recomendaciones utiles para organizar mejor tu semana.",
    },
];

const quickActions: QuickAction[] = [
    {
        title: "Rutinas",
        description: "Explora programas disponibles por fecha, actividad y profesional.",
        to: "/rutinas",
        label: "Ver rutinas",
    },
    {
        title: "Turnos",
        description: "Encuentra horarios disponibles y reserva el que mejor te quede.",
        to: "/turnos",
        label: "Ver turnos",
    },
];

export function HomePage() {
    const { user } = useAuth();
    const greeting = user?.nombre
        ? `Hola, ${user.nombre} ${user.apellido ?? ""}`.trim()
        : "Bienvenido a KinePro";

    return (
        <div className="home-page">
            <section className="home-hero" aria-labelledby="home-title">
                <div className="home-hero-copy">
                    <p className="home-eyebrow">{greeting}</p>
                    <h1 id="home-title">Gestion simple para moverte mejor</h1>
                    <p className="home-description">
                        Reserva turnos, revisa rutinas y mantenete al dia con las novedades del centro desde una experiencia clara y liviana.
                    </p>
                    <div className="home-actions" aria-label="Acciones principales">
                        <Link className="home-primary-action" to="/rutinas">Reservar rutina</Link>
                        <Link className="home-secondary-action" to="/turnos">Reservar turno</Link>
                    </div>
                </div>

                <div className="home-visual" aria-label="Resumen de KinePro">
                    <div className="home-visual-card">
                        <span>Hoy</span>
                        <strong>Agenda abierta</strong>
                        <p>Rutinas y turnos disponibles para consultar.</p>
                    </div>
                    <div className="home-visual-metrics">
                    </div>
                </div>
            </section>

            <section className="quick-actions-section" aria-labelledby="quick-actions-title">
                <div className="home-section-header">
                    <div>
                        <p className="section-label">Inicio</p>
                        <h2 id="quick-actions-title">Que queres hacer?</h2>
                    </div>
                    <p>Los accesos principales quedan a mano para que encuentres lo que necesitas sin vueltas.</p>
                </div>

                <div className="quick-actions-grid">
                    {quickActions.map((item) => (
                        <article className="quick-action-card" key={item.to}>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <Link to={item.to}>{item.label}</Link>
                        </article>
                    ))}
                </div>
            </section>

            <section className="news-section" aria-labelledby="news-title">
                <div className="home-section-header">
                    <div>
                        <p className="section-label">Novedades</p>
                        <h2 id="news-title">Noticias del centro</h2>
                    </div>
                    <p>Comunicados breves para estar al tanto de cambios, avisos y recomendaciones utiles.</p>
                </div>

                <div className="news-grid">
                    {initialNews.map((item) => (
                        <article className="news-card" key={item.id}>
                            <div className="news-card-meta">
                                <span>{item.category}</span>
                                <time>{item.date}</time>
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    )
}
