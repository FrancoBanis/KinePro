import axios from "axios";
import { ENDPOINTS_COLA_TURNO } from "../constants/config";


const BASE_URL = "http://localhost:8080";
export async function recibirRespuestaCola(turnoId: number, usuarioId: number, respuesta: boolean): Promise<void> {
  const response = await axios.post(ENDPOINTS_COLA_TURNO.RECIBIR_RESPUESTA_COLA(turnoId,usuarioId), null, {
    params: { respuesta } // Axios pone esto en la URL como query param
  });
  if (!response.status || response.status < 200 || response.status >= 300) {
    const err = response.statusText;
    throw new Error(err || "Error al agregar a la cola de espera");
  }
}

export async function enviarAviso(turnoId: number, usuarioId: number): Promise<void> {
  const response = await axios.post(ENDPOINTS_COLA_TURNO.ENVIAR_AVISO(turnoId,usuarioId), 
    {}, {withCredentials: true});
  if (!response.status || response.status < 200 || response.status >= 300 ) {
    const err = response.statusText;
    throw new Error(err || "Error al agregar a la cola de espera");
  }
}
