import axios from "axios";
import { ENDPOINTS_USUARIO } from "../constants/config";

 
export async function iniciarSesion(email: string): Promise<void> {
    await axios.post(
        ENDPOINTS_USUARIO.LOGIN,
        { email },
        { withCredentials: true }
      );
}

export async function verificarToken(email: string, token: string) {
    const res = await axios.post(
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
