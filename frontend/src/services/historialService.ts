
import type { PaginaPagosClinica, PagoClinicaData, PagoData } from "../constants/pagos";
import { ENDPOINTS_PAGOS } from "../constants/config";
import api from "./axiosInstance";

export async function getHistorialPagos(): Promise<PagoData[]> {
        const response = await api.get<PagoData[]>(ENDPOINTS_PAGOS.HISTORIAL_PAGOS)
        return response.data
}
export async function getHistorialPagosClinica(pagina: number): Promise<PaginaPagosClinica | PagoClinicaData[]> {
        const response = await api.get<PaginaPagosClinica | PagoClinicaData[]>(
          ENDPOINTS_PAGOS.HISTORIAL_PAGOS_CLINICA,
          {
            params: { pagina },
          }
        )
        return response.data
    }