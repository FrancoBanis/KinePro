import axios from "axios";
import type { PaginaPagosClinica, PagoClinicaData, PagoData } from "../constants/pagos";
import { ENDPOINTS_PAGOS } from "../constants/config";

export async function getHistorialPagos(): Promise<PagoData[]> {
        const response = await axios.get<PagoData[]>(
          ENDPOINTS_PAGOS.HISTORIAL_PAGOS,
          { withCredentials: true }
        )
        return response.data
}
export async function getHistorialPagosClinica(pagina: number): Promise<PaginaPagosClinica | PagoClinicaData[]> {
        const response = await axios.get<PaginaPagosClinica | PagoClinicaData[]>(
          ENDPOINTS_PAGOS.HISTORIAL_PAGOS_CLINICA,
          {
            params: { pagina },
            withCredentials: true,
          }
        )
        return response.data
    }