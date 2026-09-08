import api from "./axiosInstance";
import { ENDPOINTS_USUARIO } from "../constants/config";
export async function iniciarSesion(email: string): Promise<void> {
    await api.post(
        ENDPOINTS_USUARIO.LOGIN,
        { email },
      );
}

export async function verificarToken(email: string, token: string) {
    const res = await api.post(
        ENDPOINTS_USUARIO.VERIFICAR_TOKEN,
        {
          email,
          token,
        },
        {
          withCredentials: true,
        }
      );
      return res;
}
