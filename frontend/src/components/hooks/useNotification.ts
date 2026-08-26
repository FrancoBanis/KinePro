import { toast } from 'sonner';
export function useNotification() {
    return {
        exitoso: (mensaje: string) => toast.success(mensaje),
        error: (mensaje: string) => toast.error(mensaje),
        loading: (mensaje: string) => toast.loading(mensaje),
    
        promesa: async (
            promesa: Promise<any>,
            mensajes: { loading: string; success: string; error: string }
        ) => {
            return toast.promise(promesa, mensajes);
        },
    }
}