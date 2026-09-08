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

export interface RegisterForm {
  email: string;
  nombre: string;
  fechaNacimiento: string;
  apellido?: string;
  dni?: number;
}
export interface RegisterProps {
  email?: string;
}