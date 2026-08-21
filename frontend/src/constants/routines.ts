import type { TurnoData } from "./shift";
import type { TipoRutinaData } from "./tipoRutina";

export interface RutinaData {
  id: number;
  nombre: string;
  nombresDeProfesionales: string;
  tipo: TipoRutinaData;
  fechaDeInicio: string;
  fechaDeFin: string;
  horaInicio: string;
  horaFin: string;
  diaSemana : string;
  activa: boolean;
  costoPorTurno: number;
  capacidadMaxima: number;
  cupoMaxRutina: number;
  cantidadPacientesRutina: number;
  turnos: TurnoData[];
}