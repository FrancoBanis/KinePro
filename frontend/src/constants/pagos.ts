export interface PagoData {
  idPago: number
  fecha: string
  monto: number
  concepto: string
}
export interface PagoClinicaData {
  idPago: number
  nombreUsuario: string
  correoUsuario: string
  monto: number
  nombreRutina: string
  fecha: string
}

export interface PaginaPagosClinica {
  pagos: PagoClinicaData[]
  paginaActual: number
  totalPaginas: number
  totalPagos: number
}