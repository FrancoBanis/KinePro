import axios from "axios";
import { ENDPOINTS_ADMINISTRAR_USUARIOS } from "../constants/config";
import type { CreateUserForm, UpdateUserPayload, UsuarioData } from "../constants/usuarioData";




const extraerMensajeError = (err: unknown, fallback: string) => {
  if (axios.isAxiosError(err) && err.response) {
    return err.response.data?.message || fallback;
  }
  return fallback;
};

export async function buscarUsuarios(query: string): Promise<UsuarioData[]> {
  try {
    const response = await axios.get(ENDPOINTS_ADMINISTRAR_USUARIOS.BUSCAR_USUARIOS(query), {
      withCredentials: true,
    });
    return response.data;
  } catch {
    return [];
  }
}

export async function crearUsuario(payload: CreateUserForm): Promise<void> {
  try {
    await axios.post(ENDPOINTS_ADMINISTRAR_USUARIOS.CREAR_USUARIO, payload, {
      withCredentials: true,
    });
  } catch (err) {
    throw new Error(extraerMensajeError(err, "Error al crear usuario"));
  }
}

export async function actualizarUsuario(payload: UpdateUserPayload): Promise<void> {
  try {
    await axios.put(ENDPOINTS_ADMINISTRAR_USUARIOS.ACTUALIZAR_USUARIO, payload, {
      withCredentials: true,
    });
  } catch (err) {
    throw new Error(extraerMensajeError(err, "Error al guardar cambios"));
  }
}

export async function desactivarUsuario(id: number): Promise<void> {
  try {
    await axios.patch(ENDPOINTS_ADMINISTRAR_USUARIOS.DESACTIVAR_USUARIO(id), undefined, {
      withCredentials: true,
    });
  } catch (err) {
    throw new Error(extraerMensajeError(err, "Error al desactivar la cuenta"));
  }
}
