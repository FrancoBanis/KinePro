import axios from "axios";
import type { reembolsoDTO } from "../constants/reembolso";
import type { ProfesionalData } from "../constants/turno";
import { ENDPOINTS_TURNO } from "../constants/config";


export async function getProfesionales(): Promise<ProfesionalData[]> {
    const response = await fetch(ENDPOINTS_TURNO.PROFESIONALES, {
        credentials: "include",
    });
    if (!response.ok) throw new Error("Error al obtener profesionales");
    return response.json();
}
export async function getCostoTurno(turnoId : number): Promise<number>{
    const response = await axios.get(ENDPOINTS_TURNO.COSTO_TURNO, {params: {id: turnoId}});
    if (!response.status) throw new Error("Error al calcular el costo");
    return response.data;
    }

export async function getAllTurnos() {
    const response = await fetch(ENDPOINTS_TURNO.TODOS_LOS_TURNOS, {
        credentials: "include",
    });
    if (!response.ok) throw new Error("Error al obtener todos los turnos");
    return response.json();
}

export async function getTurnos() {
    const response = await fetch(ENDPOINTS_TURNO.TURNOS, {
        credentials: "include",
    });
    if (!response.ok) throw new Error("Error al obtener los turnos");
    return response.json();
}
export async function getMisTurnos(usuarioId: number) {
  const response = await axios.get( ENDPOINTS_TURNO.MIS_TURNOS, {
    params: { usuarioId },
    withCredentials: true,
  });
  return response.data;
}
export async function getMisTurnosProfesional(usuarioId: number) {
  const response = await axios.get( ENDPOINTS_TURNO.TURNOS_DE_PROFESIONAL, {
    params: { usuarioId },
    withCredentials: true,
  });
  return response.data;
}
export async function getTurnosSimilares(turnoId: number, usuarioId: number ){
    const response = await axios.get(ENDPOINTS_TURNO.TURNOS_SIMILARES, {
        params: {turnoId: turnoId, usuarioId: usuarioId},
        withCredentials: true,
    });
    if (!response.status) throw new Error("Error al obtener los turnos similares");
    return response.data;
}
export async function getRutina(rutinaId: number) {
    const response = await fetch(ENDPOINTS_TURNO.RUTINA(rutinaId));
    if (!response.ok) throw new Error("Error al obtener la rutina");
    return response.json();
}
export async function estaInscriptoEnTurno (usuarioId: number, turnoId: number) : Promise<boolean> {
    const response = await fetch(ENDPOINTS_TURNO.VERIFICAR_SI_INSCRIPTO(usuarioId,turnoId));
    if (!response.ok) throw new Error("Error al verificar inscripcion");
    return response.json();
}
export async function calcularReembolso (usuarioId : number , turnoId: number) : Promise<reembolsoDTO> {
  const response = await axios.get(ENDPOINTS_TURNO.CALCULAR_REEMBOLSO, {
    params: {turnoId: turnoId, usuarioId: usuarioId},
    withCredentials: true,
    })
    if (!response.status) throw new Error("Error al obtener los reembolsos");
    return response.data;
} 
export async function cancelarTurno (usuarioId: number, turnoId: number) : Promise<void> {
    const response = await fetch(ENDPOINTS_TURNO.CANCELAR(usuarioId,turnoId), {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) throw new Error("Error al cancelar el turno");
    window.location.reload();
    return;
}
export async function reprogramarTurno(usuarioId:number, turnoActId: number, turnoNueId: number) {
    const response = await axios.get(ENDPOINTS_TURNO.REPROGRAMAR, {
        params: {usuarioId: usuarioId, turnoActId: turnoActId, turnoNueId: turnoNueId},
        withCredentials: true,
    });
    if (!response.status) throw new Error("Error al reprogramar un turno.")
    window.location.reload();
    return;
}
export async function agregarAColaEspera(turnoId: number, usuarioId: number): Promise<void> {
  const response = await fetch(ENDPOINTS_TURNO.AGREGAR_A_COLA(turnoId,usuarioId), {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Error al agregar a la cola de espera");
  }
}