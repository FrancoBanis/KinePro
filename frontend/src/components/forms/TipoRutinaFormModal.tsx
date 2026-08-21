import { useEffect, useState } from "react";
import FormModal from "../FormModal";

export type TipoRutinaFormValues = {
  nombre: string;
  descripcion: string;
};

const emptyValues: TipoRutinaFormValues = {
  nombre: "",
  descripcion: "",
};

type Props = {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialValues?: Partial<TipoRutinaFormValues>;
  onSubmit: (values: TipoRutinaFormValues) => Promise<void> | void;
};

export default function TipoRutinaFormModal({
  open,
  onClose,
  mode,
  initialValues,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<TipoRutinaFormValues>(emptyValues);

  useEffect(() => {
    if (!open) return;
    setValues({
      ...emptyValues,
      ...initialValues,
    });
  }, [open, initialValues]);

  const handleSubmit = async () => {
    await onSubmit(values);
  };

  if (!open) return null;

  return (
    <FormModal
      isOpen={open}
      onClose={onClose}
      title={mode === "create" ? "Crear tipo de rutina" : "Editar tipo de rutina"}
      footer={
        <>
          <button className="btn-secondary" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-log" type="button" onClick={handleSubmit}>
            {mode === "create" ? "Crear" : "Guardar cambios"}
          </button>
        </>
      }
    >
      <div className="appointment-form-grid">
        <label className="appointment-field appointment-field-full">
          <span>Nombre</span>
          <input
            type="text"
            value={values.nombre}
            onChange={(e) => setValues((prev) => ({ ...prev, nombre: e.target.value }))}
            placeholder="Ej: Funcional"
          />
        </label>

        <label className="appointment-field appointment-field-full">
          <span>Descripción</span>
          <input
            type="text"
            value={values.descripcion}
            onChange={(e) => setValues((prev) => ({ ...prev, descripcion: e.target.value }))}
            placeholder="Ej: Rutinas de fuerza"
          />
        </label>
      </div>
    </FormModal>
  );
}