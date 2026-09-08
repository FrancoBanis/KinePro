import axios from "axios";
import { ENDPOINTS_ADMINISTRAR_USUARIOS } from "../constants/config";
import type { CreateUserForm, UpdateUserPayload, UsuarioData } from "../constants/usuarioData";
import api from "./axiosInstance";



export async function cambiarRolUsuario(rol: string, user: UsuarioData): Promise<void> {
  try {
    await api.patch(ENDPOINTS_ADMINISTRAR_USUARIOS.CAMBIAR_ROL(user), { ...user, rol });
  } catch (err) {
    throw new Error(extraerMensajeError(err, "Error al cambiar el rol del usuario"));
  }
}
export async function obtenerEmpleados(): Promise<UsuarioData[]> {
  try {
    const response = await api.get<UsuarioData[]>(ENDPOINTS_ADMINISTRAR_USUARIOS.EMPLEADOS);
    return response.data;
  } catch (err) {
    throw new Error(extraerMensajeError(err, "Error al obtener empleados"));
  }
}
const extraerMensajeError = (err: unknown, fallback: string) => {
  if (err && typeof err === 'object' && 'response' in err) {
    const axiosErr = err as any;
    return axiosErr.response?.data?.message || fallback;
  }
  return fallback;
};
export async function buscarUsuarios(query: string): Promise<UsuarioData[]> {
  try {
    const response = await api.get(ENDPOINTS_ADMINISTRAR_USUARIOS.BUSCAR_USUARIOS(query));
    return response.data;
  } catch {
    return [];
  }
}

export async function crearUsuario(payload: CreateUserForm): Promise<void> {
  try {
    await api.post(ENDPOINTS_ADMINISTRAR_USUARIOS.CREAR_USUARIO, payload);
  } catch (err) {
    throw new Error(extraerMensajeError(err, "Error al crear usuario"));
  }
}

export async function actualizarUsuario(payload: UpdateUserPayload): Promise<void> {
  try {
    await axios.put(ENDPOINTS_ADMINISTRAR_USUARIOS.ACTUALIZAR_USUARIO, payload);
  } catch (err) {
    throw new Error(extraerMensajeError(err, "Error al guardar cambios"));
  }
}

export async function desactivarUsuario(id: number): Promise<void> {
  try {
    await api.patch(ENDPOINTS_ADMINISTRAR_USUARIOS.DESACTIVAR_USUARIO(id));
  } catch (err) {
    throw new Error(extraerMensajeError(err, "Error al desactivar la cuenta"));
  }
}
