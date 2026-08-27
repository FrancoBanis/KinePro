import { Routes, Route, useLocation } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import Register from './pages/RegisterPage'
import { LoginPage } from './pages/LoginPage'
import ValidarToken from './pages/ValidarTokenPage'
import { PagoExitoso } from './pages/PagoExitosoPage'
import { PagoFallido } from './pages/PagoFallidoPage'
import { EditarDatosPage } from './pages/EditarMisDatos'
import { RutinasPage } from './pages/RutinasPage'
import { TurnosPage } from './pages/TurnosPage'
import { MisTurnosPage } from './pages/MisTurnosYRutinasPage'
import { ActividadesPage } from './pages/ActividadesPage'
import TipoRutinasPage from './pages/TiposDeRutinasPage'
import AdministrarUsuarios from './pages/AdministrarUsuarios'
import { HistorialTurnosPage } from './pages/HistorialTurnosPage'
import VerEmpleados from './pages/VerEmpleados'
import HistorialPagos from './pages/HistorialPagos'
import HistorialPagosClinica from './pages/HistorialPagosClinica'
import { ConfirmarColaTurno } from './pages/ConfirmarColaTurno'
import { ConfirmarColaRutina } from './pages/ConfirmarColaRutina'
import { ROUTES } from './constants/config'

function RegisterRoute() {
  const location = useLocation() as { state?: { email?: string } }
  return <Register email={location.state?.email} />
}

export default function  AppRoutes() {
  return (
    <Routes>
      
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.REGISTRO} element={<RegisterRoute />} />
      <Route path={ROUTES.INICIAR_SESION} element={<LoginPage />} />
      <Route path={ROUTES.PANEL_USUARIO} element={<EditarDatosPage />} />
      <Route path={ROUTES.MIS_TURNOS} element={<MisTurnosPage />} />
      <Route path={ROUTES.VALIDAR_TOKEN} element={<ValidarToken />} />
      <Route path={ROUTES.RUTINAS} element={<RutinasPage />} />
      <Route path={ROUTES.TURNOS} element={<TurnosPage />} />
      <Route path={ROUTES.ACTIVIDADES} element={<ActividadesPage />} />
      <Route path ={ROUTES.TIPOS_RUTINA} element={<TipoRutinasPage/>}/>
      <Route path={ROUTES.PAGO_EXITOSO} element={<PagoExitoso />} />
      <Route path={ROUTES.PAGO_FALLIDO} element={<PagoFallido />} />
      <Route path={ROUTES.ADMINISTRAR_USUARIOS} element={<AdministrarUsuarios />} />
      <Route path={ROUTES.HISTORIAL_TURNOS} element={<HistorialTurnosPage />} />
      <Route path={ROUTES.VER_EMPLEADOS} element={<VerEmpleados />} />
      <Route path={ROUTES.HISTORIAL_PAGOS} element={<HistorialPagos />} />
      <Route path={ROUTES.HISTORIAL_PAGOS_CLINICA} element={<HistorialPagosClinica />} />
      <Route path="/ConfirmarColaTurno/:turnoId/:usuarioId" element={<ConfirmarColaTurno />} />
      <Route path="/ConfirmarColaRutina/:rutinaId/:usuarioId" element={<ConfirmarColaRutina />} />
    </Routes>
  )
}
