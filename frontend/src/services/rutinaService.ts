import axios from "axios";
import { type RutinaFormValues } from "../components/forms/RutinaFormModal";

const BASE_URL = "http://localhost:8080";

export async function getRutinasActivas() : Promise<any> {
  const response = await fetch(`${BASE_URL}/rutinas/activa/true`, {
    credentials: "include",
  });
  if (!response.ok) {
    const textoError = await response.text();
    throw new Error(textoError || "Error en el servidor");
  }
  return response.json();
}
export async function getCantidadDeMisRutinas(id: number, idUsuario: number) : Promise<number> {
  const response = await axios.get(`${BASE_URL}/rutinas/mis-rutinas/contar`, {
    params: {id: id , idUsuario: idUsuario },
    withCredentials: true,
    }
  )
  return response.data;
}
export async function getRutinasSimilares(id : number,  idUsuario: number ) {
 const response = await axios.get(`${BASE_URL}/rutinas/rutinas-similares` , {
  params: {idRutina: id, idUsuario: idUsuario},
  withCredentials: true,  
 });
 if (!response.status) throw new Error("Error al obtener las rutinas similares");
 return response.data;
}
export async function getCantidadDeRutinas(id: number, idUsuario: number) : Promise<number> {
  const response = await axios.get(`${BASE_URL}/rutinas/disponibilidad`, {
    params: {id: id , idUsuario: idUsuario },
    withCredentials: true,
    }
  )
  return response.data;
}
export async function getRutina (idRutina: number) : Promise<any> {
  const response = await fetch(`${BASE_URL}/rutinas/${idRutina}`, {
        credentials: "include",
      });
      return response.json();
}

export async function getMisRutinas (idUsuario: number ) {
  const response = await axios.get(`${BASE_URL}/rutinas/mis-rutinas`, {
    params: {idUsuario},
    withCredentials: true,
  })
  return response.data;
}
export async function getTurnosDeMisRutinas (idUsuario : number,  idRutina: number ) {
  const response = await axios.get(`${BASE_URL}/rutinas/mis-rutinas/turnos`, {
    params: {idUsuario: idUsuario, idRutina: idRutina},
    withCredentials: true,
  })
  return response.data;
}
export async function handleCrearRutina(payload : RutinaFormValues){
  const response = await fetch(`${BASE_URL}/rutinas/admin`, {
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
      const response = await fetch(`${BASE_URL}/rutinas/admin/${idRutinaEnEdicion}`, {
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
    `http://localhost:8080/rutinas/${idRutinaActual}/reprogramar/${idRutinaNueva}/usuarios/${idUsuario}`,
    {}, // Body vacío
    {
      withCredentials: true 
    }
  );
  alert("Reprogramación exitosa");
  return response.data;
}
export async function handleDesactivarRutina(rutinaId: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/rutinas/admin/${rutinaId}/desactivar`, {
      method: "PATCH",
      credentials: "include",
    });
    if (!response.ok) {
        const mensaje = await response.text();
        throw new Error(mensaje || "No se pudo desactivar la rutina");
    }
    alert("Rutina desactivada de forma exitosa");
    window.location.reload();
    return;
}

export async function handleEnviarAviso(idRutina: number , mensaje: String): Promise<void> {
        try { 
          const response = await fetch( 
            `${BASE_URL}/rutinas/admin/${idRutina}/enviar-aviso`,
            {
              method : "POST",
              credentials : "include",
              headers : {"Content-Type": "application/json"},
              body: JSON.stringify({ mensaje: mensaje}),
            }
          );
          if (!response.ok) throw new Error (await response.text());
            alert ("Aviso de rutina enviado correctamente");
          } catch (e: any) { 
            alert("Error al enviar aviso" + e.message);
          } 
}
export async function handleCalcularCosto (idRutina: number, idUsuario: number) : Promise<number> {
        const response = await axios.get(`${BASE_URL}/rutinas/pago/calcular`, {
        params: {id: idRutina , idUsuario: idUsuario},
        withCredentials: true,
      });
      return response.data;
}
export async function handleVerificarInscripcion (idRutina: number, idUsuario: number) : Promise<boolean> {
    const response = await fetch(`${BASE_URL}/rutinas/${idRutina}/usuarios/${idUsuario}`, {
      credentials: "include",
    }).then(res => res.json())
    return response;
}
export async function handleCancelarRutina (idRutina: number, idUsuario: number) : Promise<void> {
  await fetch(`${BASE_URL}/rutinas/${idRutina}/usuarios/${idUsuario}` , {
        method: "DELETE",
        credentials: "include",
      });
    alert("Cancelacion exitosa");
    window.location.reload();
    return;
}

export async function agregarAColaEspera(rutinaId: number, usuarioId: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/cola-espera/${rutinaId}/usuario/${usuarioId}`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Error al agregar a la cola de espera");
  }
}
