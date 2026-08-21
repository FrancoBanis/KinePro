import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TipoRutinaFormModal, { type TipoRutinaFormValues } from "../components/forms/TipoRutinaFormModal";
import type { TipoRutinaData } from "../constants/tipoRutina";
import type { RutinaData } from "../constants/routines";
import { Turno } from "../components/Turno";

export function TipoRutinasPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const puedeEditar =
    user?.rol?.toString() === "ROLE_ADMIN" ||
    user?.rol?.toString() === "ROLE_SECRETARIA";

  const [tipos, setTipos] = useState<TipoRutinaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [tipoEnEdicion, setTipoEnEdicion] = useState<TipoRutinaData | null>(null);

  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoRutinaData | null>(null);
  const [rutinasFiltradas, setRutinasFiltradas] = useState<RutinaData[]>([]);
  const [loadingRutinas, setLoadingRutinas] = useState(false);
  const [errorRutinas, setErrorRutinas] = useState<string | null>(null);

  const cargarTipos = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/tipos-rutina", {
        credentials: "include",
      });

      if (!response.ok) {
        const texto = await response.text();
        throw new Error(texto || "Error al cargar tipos");
      }

      const data = await response.json();
      setTipos(data || []);
    } catch {
      setError("Error al obtener los tipos de rutina");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTipos();
  }, []);

  const abrirCrear = () => {
    setTipoEnEdicion(null);
    setFormMode("create");
    setOpenForm(true);
  };

  const abrirEditar = (tipo: TipoRutinaData) => {
    setTipoEnEdicion(tipo);
    setFormMode("edit");
    setOpenForm(true);
  };

  const guardarTipo = async (values: TipoRutinaFormValues) => {
    if (!values.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    const payload = {
      nombre: values.nombre.trim(),
      descripcion: values.descripcion,
    };

    const url =
      formMode === "create"
        ? "http://localhost:8080/tipos-rutina/admin"
        : `http://localhost:8080/tipos-rutina/admin/${tipoEnEdicion?.id}`;

    const method = formMode === "create" ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const texto = await response.text();
        throw new Error(texto || "No se pudo guardar");
      }

      setOpenForm(false);
      setTipoEnEdicion(null);
      await cargarTipos();
      alert("Creacion de tipo de rutina exitosa");
    } catch {
      alert("Error al guardar el tipo de rutina");
    }
  };

  const eliminarTipo = async (id: number) => {
    const confirmar = window.confirm("¿Seguro que querés eliminar este tipo de rutina?");
    if (!confirmar) return;

    try {
      const response = await fetch(`http://localhost:8080/tipos-rutina/admin/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const texto = await response.text();
        throw new Error(texto || "No se pudo eliminar");
      }
      
      await cargarTipos();
    } catch (error: any) {
      alert(error?.message || "Error al eliminar el tipo de rutina");
    }
  };

  const verRutinasAsociadas = async (tipo: TipoRutinaData) => {
    setTipoSeleccionado(tipo);
    setLoadingRutinas(true);
    setRutinasFiltradas([]);
    setErrorRutinas(null);

    try {
      const response = await fetch(
        `http://localhost:8080/rutinas?activa=true&tipoRutinaId=${tipo.id}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        const texto = await response.text();
        throw new Error(texto || "No se pudieron cargar las rutinas");
      }

      const data = await response.json();
      setRutinasFiltradas(data || []);
    } catch {
      setErrorRutinas("Error al obtener las rutinas asociadas");
    } finally {
      setLoadingRutinas(false);
    }
  };

  const volverATipos = () => {
    setTipoSeleccionado(null);
    setRutinasFiltradas([]);
    setErrorRutinas(null);
  };

  return (
    <div className="activities-page">
      <TipoRutinaFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        mode={formMode}
        initialValues={
          tipoEnEdicion
            ? {
                nombre: tipoEnEdicion.nombre,
                descripcion: tipoEnEdicion.descripcion ?? "",
              }
            : undefined
        }
        onSubmit={guardarTipo}
      />

      {!tipoSeleccionado ? (
        <>
          <section className="activities-hero">
            <div className="activities-hero-copy">
              <p className="activities-eyebrow">Tipos de rutina</p>
            </div>
          </section>

          <section className="activity-section">
            <div className="activity-section-header">
              <div>
                <h2>Tipos de Rutina</h2>
              </div>

              <span className="activity-count">
                {loading ? "Cargando" : `${tipos.length} resultados`}
              </span>
            </div>

            {puedeEditar && (
              <div className="activities-admin">
                <button className="btn-log" type="button" onClick={abrirCrear}>
                  Crear tipo de Rutina
                </button>
              </div>
            )}

            {error && <p className="activity-error">{error}</p>}

            {loading ? null : tipos.length > 0 ? (
              <div className="card-container">
                {tipos.map((tipo) => (
                  <article className="card" key={tipo.id}>
                    <h3>{tipo.nombre}</h3>
                    {tipo.descripcion && <p>{tipo.descripcion}</p>}

                    <div className="card-actions">
                      <button
                        className="btn-secondary"
                        type="button"
                        onClick={() => verRutinasAsociadas(tipo)}
                      >
                        Ver rutinas asociadas
                      </button>

                      {puedeEditar && (
                        <>
                          <button
                            className="btn-secondary"
                            type="button"
                            onClick={() => abrirEditar(tipo)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn-log"
                            type="button"
                            onClick={() => eliminarTipo(tipo.id)}
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="activity-empty">No hay tipos de rutina por ahora.</p>
            )}
          </section>
        </>
      ) : (
        <section className="activity-section">
          <div className="activity-section-header">
            <div>
              <p className="activity-kicker">Rutinas filtradas</p>
              <h2>Rutinas de {tipoSeleccionado.nombre}</h2>
            </div>

            <button className="btn-secondary" type="button" onClick={volverATipos}>
              Atrás
            </button>
          </div>

          {errorRutinas && <p className="activity-error">{errorRutinas}</p>}

          {loadingRutinas ? (
            <div className="activity-skeleton-grid" aria-label="Cargando">
              {Array.from({ length: 3 }).map((_, index) => (
                <div className="activity-card-skeleton" key={index} />
              ))}
            </div>
          ) : rutinasFiltradas.length > 0 ? (
            <div className="card-container">
              {rutinasFiltradas.map((rutina) => (
                <article className="card card-rutina" key={rutina.id}>
                  <div className="card-info">
                    <h3>{rutina.nombre}</h3>
                    <p>Profesionales: {rutina.nombresDeProfesionales}</p>
                    <p>Tipo de Rutina: {rutina.tipo?.nombre}</p>
                    <p>Fecha de Inicio: {rutina.fechaDeInicio}</p>
                    <p>Fecha de Fin: {rutina.fechaDeFin}</p>
                    <p>Costo por Turno: {rutina.costoPorTurno}</p>
                    <p>Capacidad Máxima: {rutina.capacidadMaxima}</p>

                    <div className="rutina-turnos">
                      <h4>Turnos asociados</h4>

                      {rutina.turnos?.length > 0 ? (
                        <div className="card-container">
                          {rutina.turnos.map((turno) => (
                            <Turno key={turno.id} turnoRecibido={turno} />
                          ))}
                        </div>
                      ) : (
                        <p className="activity-empty">Esta rutina no tiene turnos asociados.</p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="activity-empty">No hay rutinas para este tipo.</p>
          )}
        </section>
      )}
    </div>
  );
}

export default TipoRutinasPage;
