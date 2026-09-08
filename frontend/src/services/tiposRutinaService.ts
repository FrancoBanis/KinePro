import { ENDPOINTS_TIPO_RUTINA } from "../constants/config";
import api from "./axiosInstance";

export async function obtenerTiposRutina() {
    const response = await api.get(ENDPOINTS_TIPO_RUTINA.OBTENER_TIPOS);
    return response.data;
}

export async function eliminarTipo(id: number): Promise<Response> {
    const response = await api.delete(ENDPOINTS_TIPO_RUTINA.ELIMINAR(id));
    return response.data;
}
export async function crearOModificarTipo(tipo: any, id?: number) {
  const response = id
    ? await api.put(ENDPOINTS_TIPO_RUTINA.MODIFICAR(id), tipo)
    : await api.post(ENDPOINTS_TIPO_RUTINA.CREAR, tipo); 

  return response.data;
}