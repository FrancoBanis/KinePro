import { useEffect, useState } from "react";
import FormModal from "../FormModal";
import type { TipoRutinaData } from "../../constants/tipoRutina";

type Profesional = {
  id: number;
  nombre: string;
  apellido: string;
};

export type RutinaFormValues = {
  nombre: string;
  tipoRutinaId : number;
  nombresDeProfesionales: string;
  diaSemana: string;
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  horaFin: string;
  cupoMaxPacientesPorTurno: number;
  cupoMaxRutina: number;
  activa: boolean;
  costoPorTurno: number;
};

const emptyValues: RutinaFormValues = {
  nombre: "",
  tipoRutinaId: 0,
  nombresDeProfesionales: "",
  diaSemana: "",
  fechaInicio: "",
  fechaFin: "",
  horaInicio: "",
  horaFin: "",
  cupoMaxPacientesPorTurno: 0,
  cupoMaxRutina: 0,
  activa: false,
  costoPorTurno: 0,
};

type Props = {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialValues?: Partial<RutinaFormValues>;
  onSubmit: (values: RutinaFormValues) => Promise<void> | void;
};

export default function RutinaFormModal({
  open,
  onClose,
  mode,
  initialValues,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<RutinaFormValues>(emptyValues);
  const [tiposRutina, setTiposRutina] = useState<TipoRutinaData[]>([]);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [profesionalesDisponibles, setProfesionalesDisponibles] = useState<Profesional[]>([]);
  const [profesionalesSeleccionados, setProfesionalesSeleccionados] = useState<Profesional[]>([]);
  const [loadingProfesionales, setLoadingProfesionales] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initialValues?.tipoRutinaId && (!tiposRutina || tiposRutina.length === 0)) return;
    setValues({ ...emptyValues, ...initialValues });
}, [open, initialValues, tiposRutina]);

  useEffect(() => {
    if (!open) return;

    const cargarTipos = async () => {
      setLoadingTipos(true);

      try {
        const response = await fetch("http://localhost:8080/tipos-rutina", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Error al cargar tipos");
        }

        const data = await response.json();
        setTiposRutina(data || []);
      } catch (error) {
        console.error(error);
        setTiposRutina([]);
      } finally {
        setLoadingTipos(false);
      }
    };

    cargarTipos();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const cargarProfesionales = async () => {
      setLoadingProfesionales(true);

      try {
        const response = await fetch("http://localhost:8080/api/auth/users/profesionales", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Error al cargar profesionales");
        }

        const data = await response.json();
        setProfesionalesDisponibles(data || []);
      } catch (error) {
        console.error(error);
        setProfesionalesDisponibles([]);
      } finally {
        setLoadingProfesionales(false);
      }
    };

    cargarProfesionales();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (!profesionalesDisponibles || profesionalesDisponibles.length === 0) {
      setProfesionalesSeleccionados([]);
      return;
    }

    const nombresIniciales = (initialValues?.nombresDeProfesionales ?? "")
      .split(",")
      .map((nombre) => nombre.trim().toLowerCase())
      .filter(Boolean);

    setProfesionalesSeleccionados(
      profesionalesDisponibles.filter((profesional) =>
        nombresIniciales.includes(`${profesional.nombre} ${profesional.apellido}`.trim().toLowerCase())
      )
    );
  }, [open, initialValues, profesionalesDisponibles]);

  const agregarProfesional = (id: number) => {
    const profesional = profesionalesDisponibles.find((p) => p.id === id);
    if (!profesional) return;
    setProfesionalesSeleccionados((prev) => [...prev, profesional]);
  };

  const quitarProfesional = (id: number) => {
    setProfesionalesSeleccionados((prev) => prev.filter((p) => p.id !== id));
  };

  const handleChange = <K extends keyof RutinaFormValues>(
    key: K,
    value: RutinaFormValues[K]
  ) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    const nombresDeProfesionales = profesionalesSeleccionados
      .map((p) => `${p.nombre} ${p.apellido}`)
      .join(", ");
    await onSubmit({ ...values, nombresDeProfesionales });
  };
  
  const title = mode === "create" ? "Crear Rutina" : "Editar Rutina";
  const submitLabel = mode === "create" ? "Crear" : "Guardar cambios";

  return (
    <FormModal
      isOpen={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-log" type="button" onClick={handleSubmit}>
            {submitLabel}
          </button>
        </>
      }
    >
      <div className="appointment-form-grid">
        <label className="appointment-field appointment-field-full">
          <span>Nombre de la rutina</span>
          <input
            type="text"
            placeholder="Ej: Yoga"
            value={values.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
          />
        </label>

        <label className="appointment-field">
          <span>Tipo de rutina</span>
          <select
            value={values.tipoRutinaId}
            onChange={(e) => handleChange("tipoRutinaId", Number(e.target.value))}
          >
            <option value={0}>
              {loadingTipos ? "Cargando tipos..." : "Seleccione un tipo"}
            </option>
            {tiposRutina.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="appointment-field appointment-field-full">
          <span>Profesionales</span>
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) agregarProfesional(Number(e.target.value));
            }}
          >
            <option value="">
              {loadingProfesionales ? "Cargando profesionales..." : "Agregar profesional..."}
            </option>
            {profesionalesDisponibles
              .filter((p) => !profesionalesSeleccionados.some((sel) => sel.id === p.id))
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} {p.apellido}
                </option>
              ))}
          </select>
          {profesionalesSeleccionados.length > 0 && (
            <div className="profesionales-chips">
              {profesionalesSeleccionados.map((p) => (
                <span key={p.id} className="profesional-chip">
                  {p.nombre} {p.apellido}
                  <button
                    type="button"
                    className="profesional-chip-remove"
                    aria-label={`Quitar ${p.nombre} ${p.apellido}`}
                    onClick={() => quitarProfesional(p.id)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </label>

        <label className="appointment-field">
          <span>Día de la semana</span>
          <select
            value={values.diaSemana}
            onChange={(e) => handleChange("diaSemana", e.target.value)}
          >
            <option value="">Seleccione un día</option>
            <option value="MONDAY">Lunes</option>
            <option value="TUESDAY">Martes</option>
            <option value="WEDNESDAY">Miércoles</option>
            <option value="THURSDAY">Jueves</option>
            <option value="FRIDAY">Viernes</option>
          </select>
        </label>

        <label className="appointment-field">
          <span>Fecha de inicio</span>
          <input
            type="date"
            value={values.fechaInicio}
            onChange={(e) => handleChange("fechaInicio", e.target.value)}
          />
        </label>

        <label className="appointment-field">
          <span>Fecha de fin</span>
          <input
            type="date"
            value={values.fechaFin}
            onChange={(e) => handleChange("fechaFin", e.target.value)}
          />
        </label>

        <label className="appointment-field">
          <span>Hora de inicio</span>
          <input
            type="time"
            value={values.horaInicio}
            onChange={(e) => handleChange("horaInicio", e.target.value)}
          />
        </label>

        <label className="appointment-field">
          <span>Hora de fin</span>
          <input
            type="time"
            value={values.horaFin}
            onChange={(e) => handleChange("horaFin", e.target.value)}
          />
        </label>

        <label className="appointment-field">
          <span>Cupo máximo por turno</span>
          <input
            type="number"
            min={0}
            value={values.cupoMaxPacientesPorTurno}
            onChange={(e) =>
              handleChange("cupoMaxPacientesPorTurno", Number(e.target.value))
            }
          />
        </label>

        <label className="appointment-field">
          <span>Cupo máximo de rutina</span>
          <input
            type="number"
            min={0}
            value={values.cupoMaxRutina}
            onChange={(e) =>
              handleChange("cupoMaxRutina", Number(e.target.value))
            }
          />
        </label>

        <label className="appointment-field">
          <span>Costo por turno</span>
          <input
            type="number"
            min={0}
            value={values.costoPorTurno}
            onChange={(e) => handleChange("costoPorTurno", Number(e.target.value))}
          />
        </label>
      </div>
    </FormModal>
  );
}
