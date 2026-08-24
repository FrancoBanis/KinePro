import axios from "axios";
import { ENDPOINTS_WEBHOOKS } from "../constants/config";
import type { MercadoPagoProps } from "../constants/mercadoPagoProps";

export async function procesarPago(paymentId: string) {
    await axios.post(
        ENDPOINTS_WEBHOOKS.PROCESAR_PAGO,
        {     
            type: "payment",
            data: {
            id: paymentId,
            },
        },
        {
            withCredentials: true,
        }
    );
        
}
export async function crearPreferencia(mercadoPagoProps: MercadoPagoProps, userId: number) {
    const response = await axios.post<string>(ENDPOINTS_WEBHOOKS.CREAR_PREFERENCIA, { 
      itemId: mercadoPagoProps.itemId,
      usuarioId: mercadoPagoProps.usuarioIdParam || userId,
      tipo: mercadoPagoProps.tipo
     });
      return response.data;
}