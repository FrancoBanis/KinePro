export interface ProfesionalData {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
}

export interface TurnoData {
  id: number;
  id_rutina: number;
  dia: string;
  hora: string;
  fecha: string;
  cupoMaxPacientes: number;
  cantidadDePacientesActuales: number;
  pacientes?: unknown[];
  pacientesDesdeRutina?: { id: number }[];
  profesionales?: ProfesionalData[];
  activa?: boolean;
}