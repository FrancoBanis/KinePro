
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const ROUTES = {
    HOME: '/',
    REGISTRO: '/registro',
    INICIAR_SESION: '/iniciar-sesion',
    PANEL_USUARIO: '/panel-usuario',
    MIS_TURNOS: '/mis-turnos',
    VALIDAR_TOKEN: '/validar-token',
    RUTINAS: '/rutinas',
    TURNOS: '/turnos',
    ACTIVIDADES: '/actividades',
    TIPOS_RUTINA: '/tipos-rutina',
    PAGO_EXITOSO: '/pago-exitoso',
    PAGO_FALLIDO: '/pago-fallido',
    ADMINISTRAR_USUARIOS: '/administrar-usuarios',
    HISTORIAL_TURNOS: '/historial-turnos',
    VER_EMPLEADOS: '/ver-empleados',
    HISTORIAL_PAGOS: '/historial-pagos',
    HISTORIAL_PAGOS_CLINICA: '/historial-pagos-clinica',
}

export const ENDPOINTS_ADMINISTRAR_USUARIOS = {
    BUSCAR_USUARIOS: (query: string) => `${BACKEND_URL}/api/auth/users/search?q=${query}`,
    CREAR_USUARIO: `${BACKEND_URL}/api/auth/complete-registration`,
    ACTUALIZAR_USUARIO: `${BACKEND_URL}/api/auth/users`,
    DESACTIVAR_USUARIO: (id: number) => `${BACKEND_URL}/api/auth/users/${id}/descativar`
}
export const ENDPOINTS_COLA_RUTINA = {
    RECIBIR_RESPUESTA_COLA_RUTINA: (rutinaId: number, usuarioId: number) => 
        `${BACKEND_URL}/api/cola-espera-rutina/${rutinaId}/usuario/${usuarioId}`,
    ENVIAR_AVISO_RUTINA: (rutinaId: number, usuarioId: number) =>
        `${BACKEND_URL}/api/cola-espera-rutina/${rutinaId}/usuario/${usuarioId}`,
    AGREGAR_COLA_RUTINA: (rutinaId: number, usuarioId: number) =>
        `${BACKEND_URL}/api/cola-espera-rutina/${rutinaId}/usuario/${usuarioId}`,
    ESTA_EN_COLA_RUTINA: (rutinaId: number, usuarioId: number) =>
         `${BACKEND_URL}/api/cola-espera-rutina/${rutinaId}/usuario/${usuarioId}`
}
export const ENDPOINTS_COLA_TURNO = {
    RECIBIR_RESPUESTA_COLA: (turnoId: number, usuarioId: number) =>
        `${BACKEND_URL}/api/cola-espera/${turnoId}/usuario/${usuarioId}/recibir-respuesta`,
    ENVIAR_AVISO: (turnoId: number, usuarioId: number) =>
        `${BACKEND_URL}/api/cola-espera/${turnoId}/usuario/${usuarioId}/enviar-aviso`
}
export const ENDPOINTS_RUTINA = {
    RUTINAS_ACTIVAS: `${BACKEND_URL}/rutinas/activa/true`,
    CANTIDAD_DE_MIS_RUTINAS: `${BACKEND_URL}/rutinas/mis-rutinas/contar`,
    RUTINAS_SIMILARES: `${BACKEND_URL}/rutinas/rutinas-similares`,
    CANTIDAD_DE_RUTINAS: `${BACKEND_URL}/rutinas/disponibilidad`,
    MIS_RUTINAS: `${BACKEND_URL}/rutinas/mis-rutinas`,
    MIS_TURNOS: `${BACKEND_URL}/rutinas/mis-rutinas/turnos`,
    CREAR_RUTINA: `${BACKEND_URL}/rutinas/admin`,
    CALCULAR_COSTO: `${BACKEND_URL}/rutinas/pago/calcular`,
    MODIFICAR_RUTINA: (idRutinaEnEdicion: number) => `${BACKEND_URL}/rutinas/admin/${idRutinaEnEdicion}`,
    REPROGRAMAR_RUTINA: (idUsuario: number, idRutinaActual: number, idRutinaNueva: number) =>
        `${BACKEND_URL}/rutinas/${idRutinaActual}/reprogramar/${idRutinaNueva}/usuarios/${idUsuario}`,

    RUTINA: (idRutina:number) => `${BACKEND_URL}/rutinas/${idRutina}`,
    
    DESACTIVAR_RUTINA: (idRutina: number) =>
        `${BACKEND_URL}/rutinas/admin/${idRutina}/desactivar`,
   
    ENVIAR_AVISO: (idRutina: number) => 
        `${BACKEND_URL}/rutinas/admin/${idRutina}/enviar-aviso`,
    
   
    VERIFICAR_INSCRIPCION: (idRutina: number, idUsuario: number) =>
        `${BACKEND_URL}/rutinas/${idRutina}/usuarios/${idUsuario}`,
    
    CANCELAR_RUTNA: (idRutina: number, idUsuario: number) => 
        `${BACKEND_URL}/rutinas/${idRutina}/usuarios/${idUsuario}`,

    AGREGAR_COLA_ESPERA: (rutinaId: number, idUsuario: number) =>
        `${BACKEND_URL}/cola-espera/${rutinaId}/usuario/${idUsuario}`
}
export const ENDPOINTS_TURNO = {
    PROFESIONALES: `${BACKEND_URL}/api/auth/users/profesionales`,
    COSTO_TURNO: `${BACKEND_URL}/turnos/pago`,
    TODOS_LOS_TURNOS: `${BACKEND_URL}/turnos/todos`,
    TURNOS : `${BACKEND_URL}/turnos`,
    MIS_TURNOS: `${BACKEND_URL}/turnos/mis-turnos`,
    TURNOS_DE_PROFESIONAL: `${BACKEND_URL}/turnos/mis-turnos-profesional`,
    TURNOS_SIMILARES: `${BACKEND_URL}/turnos/turnos-similares`,
    RUTINA: (idRutina: number) => `${BACKEND_URL}/rutinas/${idRutina}`,
    VERIFICAR_SI_INSCRIPTO: (idUsuario: number, idTurno: number) =>
        `${BACKEND_URL}/turnos/${idTurno}/pacientes/${idUsuario}`,       
    CALCULAR_REEMBOLSO: `${BACKEND_URL}/turnos/calcular-reembolso`,
    CANCELAR: (idUsuario: number, idTurno: number) =>
        `${BACKEND_URL}/turnos/${idTurno}/pacientes/${idUsuario}`,
    REPROGRAMAR: `${BACKEND_URL}/turnos/reprogramar`,
    AGREGAR_A_COLA: (idTurno: number, idUsuario: number) =>
        `${BACKEND_URL}/api/cola-espera/${idTurno}/usuario/${idUsuario}`,
}

export const ENDPOINTS_USUARIO = {
    LOGIN: `${BACKEND_URL}/api/auth/login`,
    VERIFICAR_TOKEN: `${BACKEND_URL}/api/auth/verify-token`,
}
export const ENDPOINTS_WEBHOOKS = {
    PROCESAR_PAGO : `${BACKEND_URL}/api/webhook/mercadopago`,
    CREAR_PREFERENCIA: `${BACKEND_URL}/api/pagos/crear-preferencia`,
}
export const ENDPOINTS_TIPO_RUTINA = {
    OBTENER_TIPOS: `${BACKEND_URL}/tipos-rutina`,
    OBTENER_RUTINAS_ASOCIADAS: (id: number) => `${BACKEND_URL}/rutinas?tipoRutinaId=${id}`,
    CREAR: `${BACKEND_URL}/tipos-rutina/admin`,
    ELIMINAR: (id: number) => `${BACKEND_URL}/tipos-rutina/admin/${id}`,
    MODIFICAR: (id: number) => `${BACKEND_URL}/tipos-rutina/admin/${id}`,
}
export const ENDPOINTS_PAGOS = {
    HISTORIAL_PAGOS: `${BACKEND_URL}/api/pagos/historial`,
    HISTORIAL_PAGOS_CLINICA: `${BACKEND_URL}/api/pagos/historial-clinica`,
}