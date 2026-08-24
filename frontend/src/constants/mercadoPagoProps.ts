export interface MercadoPagoProps {
    itemId: number
    tipo: "rutina" | "turno";
    usuarioIdParam?: number;
}