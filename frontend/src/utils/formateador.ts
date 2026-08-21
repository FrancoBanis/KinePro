const diasEnEspanol: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

export const formatearDiaEnEspanol = (dia?: string) => {
  if (!dia) return "Sin día";
  return diasEnEspanol[dia] ?? dia;
};

export const formatearFechaEnEspanol = (fecha?: string) => {
  if (!fecha) return "Sin fecha";
  const fechaLocal = new Date(`${fecha}T00:00:00`);
  if (Number.isNaN(fechaLocal.getTime())) return fecha;
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "long" }).format(fechaLocal);
};

const formatearFechaISO = (fecha: Date): string => {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
};

export const obtenerLimitesFechaNacimiento = () => {
  const hoy = new Date();
  const haceMuchosAnios = new Date(hoy.getFullYear() - 120, hoy.getMonth(), hoy.getDate());
  return {
    max: formatearFechaISO(hoy),
    min: formatearFechaISO(haceMuchosAnios),
  };
};

export const calcularEdad = (fechaNacimiento?: string): number => {
  if (!fechaNacimiento) return 0;
  const nacimiento = new Date(`${fechaNacimiento}T00:00:00`);
  if (Number.isNaN(nacimiento.getTime())) return 0;
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const diferenciaMeses = hoy.getMonth() - nacimiento.getMonth();
  if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};