import axios from "axios";

const BASE_URL = "http://localhost:8080";

export interface UsuarioData {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: string;
  dni: number;
  rol: string;
}

export interface CreateUserForm {
  email: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  dni: number;
}

export interface UpdateUserPayload {
  nombre?: string;
  apellido?: string;
  dni: number;
  fechaNacimiento: string;
  email?: string;
  rol?: string;
}

const extraerMensajeError = (err: unknown, fallback: string) => {
  if (axios.isAxiosError(err) && err.response) {
    return err.response.data?.message || fallback;
  }
  return fallback;
};

export async function buscarUsuarios(query: string): Promise<UsuarioData[]> {
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/users/search?q=${query}`, {
      withCredentials: true,
    });
    return response.data;
  } catch {
    return [];
  }
}

export async function crearUsuario(payload: CreateUserForm): Promise<void> {
  try {
    await axios.post(`${BASE_URL}/api/auth/complete-registration`, payload, {
      withCredentials: true,
    });
  } catch (err) {
    throw new Error(extraerMensajeError(err, "Error al crear usuario"));
  }
}

export async function actualizarUsuario(payload: UpdateUserPayload): Promise<void> {
  try {
    await axios.put(`${BASE_URL}/api/auth/users`, payload, {
      withCredentials: true,
    });
  } catch (err) {
    throw new Error(extraerMensajeError(err, "Error al guardar cambios"));
  }
}

export async function desactivarUsuario(id: number): Promise<void> {
  try {
    await axios.patch(`${BASE_URL}/api/auth/users/${id}/desactivar`, undefined, {
      withCredentials: true,
    });
  } catch (err) {
    throw new Error(extraerMensajeError(err, "Error al desactivar la cuenta"));
  }
}
