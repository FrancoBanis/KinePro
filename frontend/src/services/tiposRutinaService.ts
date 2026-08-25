import { ENDPOINTS_TIPO_RUTINA } from "../constants/config";

export async function obtenerTiposRutina() {
    const response = await fetch(ENDPOINTS_TIPO_RUTINA.OBTENER_TIPOS, {
        credentials: "include",
      });
    return response;
}

export async function eliminarTipo(id: number): Promise<Response> {
    const response = await fetch(ENDPOINTS_TIPO_RUTINA.ELIMINAR(id), {
        method: "DELETE",
        credentials: "include",
      });
        if (!response.ok) {
        const texto = await response.text();
        throw new Error(texto || "No se pudo eliminar");
      }
    return response;
}
export async function crearOModificarTipo(tipo: any, id?: number): Promise<Response> {
    const url = id ? ENDPOINTS_TIPO_RUTINA.MODIFICAR(id) : ENDPOINTS_TIPO_RUTINA.CREAR;
    const method = id ? "PUT" : "POST";
  
    const response = await fetch(url, {
      method: method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tipo),
    });
  
    if (!response.ok) {
      const texto = await response.text();
      throw new Error(texto || "No se pudo guardar");
    }
  
    return response;
  }