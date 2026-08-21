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
import { MisTurnosPage } from './pages/MisTurnosPage'
import { ActividadesPage } from './pages/ActividadesPage'
import TipoRutinasPage from './pages/TiposDeRutinasPage'
import AdministrarUsuarios from './pages/AdministrarUsuarios'
import { HistorialTurnosPage } from './pages/HistorialTurnosPage'
import VerEmpleados from './pages/VerEmpleados'
import HistorialPagos from './pages/HistorialPagos'
import HistorialPagosClinica from './pages/HistorialPagosClinica'
import { ConfirmarColaTurno } from './pages/ConfirmarColaTurno'
import { ConfirmarColaRutina } from './pages/ConfirmarColaRutina'

function RegisterRoute() {
  const location = useLocation() as { state?: { email?: string } }
  return <Register email={location.state?.email} />
}

export default function  AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/register' element={<RegisterRoute />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/UserPanel' element={<EditarDatosPage />} />
      <Route path='/mis-turnos' element={<MisTurnosPage />} />
      <Route path='/validarToken' element={<ValidarToken />} />
      <Route path='/rutinas' element={<RutinasPage />} />
      <Route path='/turnos' element={<TurnosPage />} />
      <Route path='/actividades' element={<ActividadesPage />} />
      <Route path ='tipos-rutina' element={<TipoRutinasPage/>}/>
      <Route path="/pago-exitoso" element={<PagoExitoso />} />
      <Route path="/pago-fallido" element={<PagoFallido />} />
      <Route path="/administrar-usuarios" element={<AdministrarUsuarios />} />
      <Route path="/historial-turnos" element={<HistorialTurnosPage />} />
      <Route path="/ver-empleados" element={<VerEmpleados />} />
      <Route path="/historial-pagos" element={<HistorialPagos />} />
      <Route path="/historial-pagos-clinica" element={<HistorialPagosClinica />} />
      <Route path="/ConfirmarColaTurno/:turnoId/:usuarioId" element={<ConfirmarColaTurno />} />
      <Route path="/ConfirmarColaRutina/:rutinaId/:usuarioId" element={<ConfirmarColaRutina />} />
    </Routes>
  )
}
