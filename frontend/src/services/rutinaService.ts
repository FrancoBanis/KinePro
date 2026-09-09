import api from "./axiosInstance";
import { type RutinaFormValues } from "../components/forms/RutinaFormModal";
import { ENDPOINTS_RUTINA } from "../constants/config";
export async function getRutinasActivas() : Promise<any> {
  const response = await api.get(ENDPOINTS_RUTINA.RUTINAS_ACTIVAS);
  return response.data;
}
export async function getCantidadDeMisRutinas(id: number, idUsuario: number) : Promise<number> {
  const response = await api.get(ENDPOINTS_RUTINA.CANTIDAD_DE_MIS_RUTINAS,{params: {id: id , idUsuario: idUsuario}})
  return response.data;
}
export async function getRutinasSimilares(id : number,  idUsuario: number ) {
 const response = await api.get(ENDPOINTS_RUTINA.RUTINAS_SIMILARES, {params: {idRutina: id, idUsuario: idUsuario}});
 return response.data;
}
export async function getCantidadDeRutinas(id: number, idUsuario: number) : Promise<number> {
  const response = await api.get(ENDPOINTS_RUTINA.CANTIDAD_DE_RUTINAS, {params: {id: id , idUsuario: idUsuario }})
  return response.data;
}
export async function getRutina (idRutina: number) : Promise<any> {
  const response = await api.get(ENDPOINTS_RUTINA.RUTINA(idRutina));
      return response.data;
}

export async function getMisRutinas (idUsuario: number ) {
  const response = await api.get(ENDPOINTS_RUTINA.MIS_RUTINAS, {params: {idUsuario}})
  return response.data;
}
export async function getTurnosDeMisRutinas (idUsuario : number,  idRutina: number ) {
  const response = await api.get(ENDPOINTS_RUTINA.MIS_TURNOS, {params: {idUsuario: idUsuario, idRutina: idRutina}})
  return response.data;
}
export async function handleCrearRutina(payload : RutinaFormValues){
  const response = await api.post(ENDPOINTS_RUTINA.CREAR_RUTINA, payload);
    return response;
} 
    export async function handleModificarRutina(idRutinaEnEdicion: number, payload: RutinaFormValues) {
      const response = await api.put(ENDPOINTS_RUTINA.MODIFICAR_RUTINA(idRutinaEnEdicion),payload);
      return response.data;
    }
export async function reprogramarRutina(idUsuario: number, idRutinaActual: number, idRutinaNueva: number): Promise<any> {
  const response = await api.post(ENDPOINTS_RUTINA.REPROGRAMAR_RUTINA(idUsuario,idRutinaActual,idRutinaNueva));
  return response.data;
}
export async function handleDesactivarRutina(rutinaId: number,  onSuccess?: () => void): Promise<void> {
    await api.patch(ENDPOINTS_RUTINA.DESACTIVAR_RUTINA(rutinaId));
    
    onSuccess?.();
    return;
}

export async function handleEnviarAviso(idRutina: number , mensaje: String): Promise<void> {
  await api.post(ENDPOINTS_RUTINA.ENVIAR_AVISO(idRutina),{mensaje});
}
export async function handleCalcularCosto (idRutina: number, idUsuario: number) : Promise<number> {
        const response = await api.get(ENDPOINTS_RUTINA.CALCULAR_COSTO, {params: {id: idRutina , idUsuario: idUsuario}});
      return response.data;
}
export async function handleVerificarInscripcion (idRutina: number, idUsuario: number) : Promise<boolean> {
    const response = await api.get(ENDPOINTS_RUTINA.VERIFICAR_INSCRIPCION(idRutina,idUsuario));
    return response.data;
}
export async function handleCancelarRutina (idRutina: number, idUsuario: number) : Promise<void> {
  await api.delete(ENDPOINTS_RUTINA.CANCELAR_RUTNA(idRutina,idUsuario));
}

export async function agregarAColaEspera(rutinaId: number, usuarioId: number): Promise<void> {
  await api.post(ENDPOINTS_RUTINA.AGREGAR_COLA_ESPERA(rutinaId,usuarioId));
}
