import api from "./axiosInstance";
import type { reembolsoDTO } from "../constants/reembolso";
import type { ProfesionalData } from "../constants/turno";
import { ENDPOINTS_TURNO } from "../constants/config";

export async function getProfesionales(): Promise<ProfesionalData[]> {
    const response = await api.get(ENDPOINTS_TURNO.PROFESIONALES);
    return response.data;
}
export async function getCostoTurno(turnoId : number): Promise<number>{
    const response = await api.get(ENDPOINTS_TURNO.COSTO_TURNO, {params: {id: turnoId}});
    return response.data;
    }

export async function getAllTurnos() {
    const response = await api.get(ENDPOINTS_TURNO.TODOS_LOS_TURNOS);
    return response.data;
}

export async function getTurnos() {
    const response = await api.get(ENDPOINTS_TURNO.TURNOS);
    return response.data;
}
export async function getMisTurnos(usuarioId: number) {
  const response = await api.get( ENDPOINTS_TURNO.MIS_TURNOS, {params: { usuarioId }});
  return response.data;
}
export async function getMisTurnosProfesional(usuarioId: number) {
  const response = await api.get( ENDPOINTS_TURNO.TURNOS_DE_PROFESIONAL, {params: { usuarioId }});
  return response.data;
}
export async function getTurnosSimilares(turnoId: number, usuarioId: number ){
    const response = await api.get(ENDPOINTS_TURNO.TURNOS_SIMILARES, {params: {turnoId: turnoId, usuarioId: usuarioId}});
    return response.data;
}
export async function getRutina(rutinaId: number) {
    const response = await api.get(ENDPOINTS_TURNO.RUTINA(rutinaId));
    return response.data;
}
export async function estaInscriptoEnTurno (usuarioId: number, turnoId: number) : Promise<boolean> {
    const response = await api.get(ENDPOINTS_TURNO.VERIFICAR_SI_INSCRIPTO(usuarioId,turnoId));
    return response.data;
}
export async function calcularReembolso (usuarioId : number , turnoId: number) : Promise<reembolsoDTO> {
  const response = await api.get(ENDPOINTS_TURNO.CALCULAR_REEMBOLSO,{params: {turnoId: turnoId, usuarioId: usuarioId}})
    return response.data;
} 
export async function cancelarTurno (usuarioId: number, turnoId: number) : Promise<void> {
    await api.delete(ENDPOINTS_TURNO.CANCELAR(usuarioId,turnoId));
}
export async function reprogramarTurno(usuarioId:number, turnoActId: number, turnoNueId: number) {
    await api.get(ENDPOINTS_TURNO.REPROGRAMAR, { params: {usuarioId: usuarioId, turnoActId: turnoActId, turnoNueId: turnoNueId}});
}
export async function agregarAColaEspera(turnoId: number, usuarioId: number): Promise<void> {
  await api.get(ENDPOINTS_TURNO.AGREGAR_A_COLA(turnoId,usuarioId));
}