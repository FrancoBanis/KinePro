import { ENDPOINTS_COLA_TURNO } from "../constants/config";
import api from "./axiosInstance";


export async function recibirRespuestaCola(turnoId: number, usuarioId: number, respuesta: boolean): Promise<void> {
  await api.post(ENDPOINTS_COLA_TURNO.RECIBIR_RESPUESTA_COLA(turnoId,usuarioId), null,{ params: { respuesta }});
}

export async function enviarAviso(turnoId: number, usuarioId: number): Promise<void> {
  await api.post(ENDPOINTS_COLA_TURNO.ENVIAR_AVISO(turnoId,usuarioId));
}
export async function estaEnColaDeEspera(turnoId: number, usuarioId: number): Promise<boolean> {
  try {
    const response = await api.get<boolean>(ENDPOINTS_COLA_TURNO.ESTA_EN_COLA(turnoId,usuarioId));
    return response.data;
  } catch (error) {
    console.error("Error al verificar cola de espera:", error);
    return false;
  }
}