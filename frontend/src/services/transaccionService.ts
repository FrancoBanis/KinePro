import axios from "axios";
import { ENDPOINTS_WEBHOOKS } from "../constants/config";

export async function procesarPago(paymentId: string, status: string) {
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