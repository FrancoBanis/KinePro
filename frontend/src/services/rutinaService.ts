import axios from "axios";
import { type RutinaFormValues } from "../components/forms/RutinaFormModal";
import { ENDPOINTS_RUTINA } from "../constants/config";
import { toast } from 'sonner';
export async function getRutinasActivas() : Promise<any> {
  const response = await fetch(ENDPOINTS_RUTINA.RUTINAS_ACTIVAS, {
    credentials: "include",
  });
  if (!response.ok) {
    const textoError = await response.text();
    throw new Error(textoError || "Error en el servidor");
  }
  return response.json();
}
export async function getCantidadDeMisRutinas(id: number, idUsuario: number) : Promise<number> {
  const response = await axios.get(ENDPOINTS_RUTINA.CANTIDAD_DE_MIS_RUTINAS, {
    params: {id: id , idUsuario: idUsuario },
    withCredentials: true,
    }
  )
  return response.data;
}
export async function getRutinasSimilares(id : number,  idUsuario: number ) {
 const response = await axios.get(ENDPOINTS_RUTINA.RUTINAS_SIMILARES, {
  params: {idRutina: id, idUsuario: idUsuario},
  withCredentials: true,  
 });
 if (!response.status) throw new Error("Error al obtener las rutinas similares");
 return response.data;
}
export async function getCantidadDeRutinas(id: number, idUsuario: number) : Promise<number> {
  const response = await axios.get(ENDPOINTS_RUTINA.CANTIDAD_DE_RUTINAS, {
    params: {id: id , idUsuario: idUsuario },
    withCredentials: true,
    }
  )
  return response.data;
}
export async function getRutina (idRutina: number) : Promise<any> {
  const response = await fetch(ENDPOINTS_RUTINA.RUTINA(idRutina), {
        credentials: "include",
      });
      return response.json();
}

export async function getMisRutinas (idUsuario: number ) {
  const response = await axios.get(ENDPOINTS_RUTINA.MIS_RUTINAS, {
    params: {idUsuario},
    withCredentials: true,
  })
  return response.data;
}
export async function getTurnosDeMisRutinas (idUsuario : number,  idRutina: number ) {
  const response = await axios.get(ENDPOINTS_RUTINA.MIS_TURNOS, {
    params: {idUsuario: idUsuario, idRutina: idRutina},
    withCredentials: true,
  })
  return response.data;
}
export async function handleCrearRutina(payload : RutinaFormValues){
  const response = await fetch(ENDPOINTS_RUTINA.CREAR_RUTINA, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
      body: JSON.stringify(payload),
    }
  );
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "No se pudo guardar la rutina");
    }
    return response;
} 
    export async function handleModificarRutina(idRutinaEnEdicion: number, payload: RutinaFormValues) {
      const response = await fetch(ENDPOINTS_RUTINA.MODIFICAR_RUTINA(idRutinaEnEdicion), {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "No se pudo guardar la rutina");
      }
      return result;
    }
export async function reprogramarRutina(idUsuario: number, idRutinaActual: number, idRutinaNueva: number): Promise<any> {
  const response = await axios.post(
    ENDPOINTS_RUTINA.REPROGRAMAR_RUTINA(idUsuario,idRutinaActual,idRutinaNueva),
    {}, // Body vacío
    {
      withCredentials: true 
    }
  );
  alert("Reprogramación exitosa");
  return response.data;
}
export async function handleDesactivarRutina(rutinaId: number,  onSuccess?: () => void): Promise<void> {
    const response = await fetch(ENDPOINTS_RUTINA.DESACTIVAR_RUTINA(rutinaId), {
      method: "PATCH",
      credentials: "include",
    });
    if (!response.ok) {
        const mensaje = await response.text();
        toast.error(mensaje || "No se pudo desactivar la rutina");
    }
    toast.success("Rutina desactivada de forma exitosa");
    onSuccess?.();
    return;
}

export async function handleEnviarAviso(idRutina: number , mensaje: String): Promise<void> {
        try { 
          const response = await fetch( 
            ENDPOINTS_RUTINA.ENVIAR_AVISO(idRutina),
            {
              method : "POST",
              credentials : "include",
              headers : {"Content-Type": "application/json"},
              body: JSON.stringify({ mensaje: mensaje}),
            }
          );
          if (!response.ok) throw new Error (await response.text());
            toast.success("Aviso de rutina enviado correctamente");
          } catch (e: any) { 
            toast.error("Error al enviar aviso" + e.message);
          } 
}
export async function handleCalcularCosto (idRutina: number, idUsuario: number) : Promise<number> {
        const response = await axios.get(ENDPOINTS_RUTINA.CALCULAR_COSTO, {
        params: {id: idRutina , idUsuario: idUsuario},
        withCredentials: true,
      });
      return response.data;
}
export async function handleVerificarInscripcion (idRutina: number, idUsuario: number) : Promise<boolean> {
    const response = await fetch(ENDPOINTS_RUTINA.VERIFICAR_INSCRIPCION(idRutina,idUsuario), {
      credentials: "include",
    }).then(res => res.json())
    return response;
}
export async function handleCancelarRutina (idRutina: number, idUsuario: number) : Promise<void> {
  await fetch(ENDPOINTS_RUTINA.CANCELAR_RUTNA(idRutina,idUsuario), {
        method: "DELETE",
        credentials: "include",
      });
    alert("Cancelacion exitosa");
    window.location.reload();
    return;
}

export async function agregarAColaEspera(rutinaId: number, usuarioId: number): Promise<void> {
  const response = await fetch(ENDPOINTS_RUTINA.AGREGAR_COLA_ESPERA(rutinaId,usuarioId), {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Error al agregar a la cola de espera");
  }
}
