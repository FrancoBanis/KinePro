import axios from "axios";
import type { reembolsoDTO } from "../constants/reembolso";
import type { ProfesionalData } from "../constants/shift";

const BASE_URL = "http://localhost:8080";

export async function getProfesionales(): Promise<ProfesionalData[]> {
    const response = await fetch(`${BASE_URL}/api/auth/users/profesionales`, {
        credentials: "include",
    });
    if (!response.ok) throw new Error("Error al obtener profesionales");
    return response.json();
}
export async function getCostoTurno(turnoId : number): Promise<number>{
    const response = await axios.get(`${BASE_URL}/turnos/pago`, {params: {id: turnoId}});
    if (!response.status) throw new Error("Error al calcular el costo");
    return response.data;
    }

export async function getAllTurnos() {
    const response = await fetch(`${BASE_URL}/turnos/todos`, {
        credentials: "include",
    });
    if (!response.ok) throw new Error("Error al obtener todos los turnos");
    return response.json();
}

export async function getTurnos() {
    const response = await fetch(`${BASE_URL}/turnos`, {
        credentials: "include",
    });
    if (!response.ok) throw new Error("Error al obtener los turnos");
    return response.json();
}
export async function getMisTurnos(usuarioId: number) {
  const response = await axios.get(`${BASE_URL}/turnos/mis-turnos`, {
    params: { usuarioId },
    withCredentials: true,
  });
  return response.data;
}
export async function getMisTurnosProfesional(usuarioId: number) {
  const response = await axios.get(`${BASE_URL}/turnos/mis-turnos-profesional`, {
    params: { usuarioId },
    withCredentials: true,
  });
  return response.data;
}
export async function getTurnosSimilares(turnoId: number, usuarioId: number ){
    const response = await axios.get(`${BASE_URL}/turnos/turnos-similares`, {
        params: {turnoId: turnoId, usuarioId: usuarioId},
        withCredentials: true,
    });
    if (!response.status) throw new Error("Error al obtener los turnos similares");
    return response.data;
}
export async function getRutina(rutinaId: number) {
    const response = await fetch(`${BASE_URL}/rutinas/${rutinaId}`);
    if (!response.ok) throw new Error("Error al obtener la rutina");
    return response.json();
}
export async function estaInscriptoEnTurno (usuarioId: number, turnoId: number) : Promise<boolean> {
    const response = await fetch(`${BASE_URL}/turnos/${turnoId}/pacientes/${usuarioId}`);
    if (!response.ok) throw new Error("Error al verificar inscripcion");
    return response.json();
}
export async function calcularReembolso (usuarioId : number , turnoId: number) : Promise<reembolsoDTO> {
  const response = await axios.get(`${BASE_URL}/turnos/calcular-reembolso`, {
    params: {turnoId: turnoId, usuarioId: usuarioId},
    withCredentials: true,
    })
    if (!response.status) throw new Error("Error al obtener los reembolsos");
    return response.data;
} 
export async function cancelarTurno (usuarioId: number, turnoId: number) : Promise<void> {
    const response = await fetch(`${BASE_URL}/turnos/${turnoId}/pacientes/${usuarioId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) throw new Error("Error al cancelar el turno");
    window.location.reload();
    return;
}
export async function reprogramarTurno(usuarioId:number, turnoActId: number, turnoNueId: number) {
    const response = await axios.get(`${BASE_URL}/turnos/reprogramar`, {
        params: {usuarioId: usuarioId, turnoActId: turnoActId, turnoNueId: turnoNueId},
        withCredentials: true,
    });
    if (!response.status) throw new Error("Error al reprogramar un turno.")
    window.location.reload();
    return;
}
export async function agregarAColaEspera(turnoId: number, usuarioId: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/cola-espera/${turnoId}/usuario/${usuarioId}`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Error al agregar a la cola de espera");
  }
}