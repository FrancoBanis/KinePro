
import { ENDPOINTS_COLA_RUTINA } from "../constants/config";
import api from "./axiosInstance";

export async function recibirRespuestaColaRutina(rutinaId: number, usuarioId: number, respuesta: boolean): Promise<void> {
  await api.post(
    ENDPOINTS_COLA_RUTINA.RECIBIR_RESPUESTA_COLA_RUTINA(rutinaId,usuarioId), 
    null, 
    {
      params: { respuesta }
    }
  );

}

export async function enviarAvisoRutina(rutinaId: number, usuarioId: number): Promise<void> {
  await api.post(ENDPOINTS_COLA_RUTINA.ENVIAR_AVISO_RUTINA(rutinaId,usuarioId));
}

export async function agregarAColaRutina(rutinaId: number, usuarioId: number): Promise<any> {
  const response = await api.post(ENDPOINTS_COLA_RUTINA.AGREGAR_COLA_RUTINA(rutinaId,usuarioId));
  return response.data;
}


export async function estaEnColaRutina(rutinaId: number, usuarioId: number): Promise<boolean> {
  const response = await api.get(ENDPOINTS_COLA_RUTINA.ESTA_EN_COLA_RUTINA(rutinaId,usuarioId));
  return response.data;
}