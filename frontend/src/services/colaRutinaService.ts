import axios from "axios";
import { ENDPOINTS_COLA_RUTINA } from "../constants/config";

/**
 * Registra la respuesta del usuario (aceptar/rechazar) cuando se libera una vacante en la rutina.
 */
export async function recibirRespuestaColaRutina(rutinaId: number, usuarioId: number, respuesta: boolean): Promise<void> {
  const response = await axios.post(
    ENDPOINTS_COLA_RUTINA.RECIBIR_RESPUESTA_COLA_RUTINA(rutinaId,usuarioId), 
    null, 
    {
      params: { respuesta } // Axios mapea esto automáticamente como Query Param
    }
  );
  
  if (!response.status || response.status < 200 || response.status >= 300) {
    const err = response.statusText;
    throw new Error(err || "Error al procesar la respuesta de la cola de rutina");
  }
}

/**
 * Envía el correo electrónico de aviso al usuario correspondiente.
 */
export async function enviarAvisoRutina(rutinaId: number, usuarioId: number): Promise<void> {
  const response = await axios.post(
    ENDPOINTS_COLA_RUTINA.ENVIAR_AVISO_RUTINA(rutinaId,usuarioId), 
    {}, 
    { withCredentials: true }
  );
  
  if (!response.status || response.status < 200 || response.status >= 300) {
    const err = response.statusText;
    throw new Error(err || "Error al enviar el aviso de la cola de rutina");
  }
}

/**
 * Agrega proactivamente a un usuario a la cola de espera de una rutina.
 */
export async function agregarAColaRutina(rutinaId: number, usuarioId: number): Promise<any> {
  const response = await axios.post(
    ENDPOINTS_COLA_RUTINA.AGREGAR_COLA_RUTINA(rutinaId,usuarioId), 
    {}, 
    { withCredentials: true }
  );
  
  if (!response.status || response.status < 200 || response.status >= 300) {
    const err = response.statusText;
    throw new Error(err || "Error al unirse a la cola de espera de la rutina");
  }
  return response.data;
}

/**
 * Comprueba si un usuario en particular ya está anotado en la lista de espera de la rutina.
 */
export async function estaEnColaRutina(rutinaId: number, usuarioId: number): Promise<boolean> {
  const response = await axios.get(
    ENDPOINTS_COLA_RUTINA.ESTA_EN_COLA_RUTINA(rutinaId,usuarioId), 
    { withCredentials: true }
  );
  return response.data;
}