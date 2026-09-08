import { ENDPOINTS_WEBHOOKS } from "../constants/config";
import type { MercadoPagoProps } from "../constants/mercadoPagoProps";
import api from "./axiosInstance";

export async function procesarPago(paymentId: string) {
    await api.post(ENDPOINTS_WEBHOOKS.PROCESAR_PAGO,
        {     
            type: "payment",
            data: {
            id: paymentId,
            },
        });
        
}
export async function crearPreferencia(mercadoPagoProps: MercadoPagoProps, userId: number) {
    const response = await api.post<string>(ENDPOINTS_WEBHOOKS.CREAR_PREFERENCIA, { 
      itemId: mercadoPagoProps.itemId,
      usuarioId: mercadoPagoProps.usuarioIdParam || userId,
      tipo: mercadoPagoProps.tipo
     });
      return response.data;
}