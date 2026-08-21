import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Header.css'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { formatUserRole } from '../utils/roles'
import { ROUTES } from '../constants/config'

export function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const isAdmin = String(user?.rol) === 'ROLE_ADMIN' || String(user?.rol) === '0';
    const isSecretary = String(user?.rol) === 'ROLE_SECRETARIA' || String(user?.rol) === '1';
    const canViewClinicPayments = isAdmin || isSecretary;
    const userDisplayName = user
        ? [user.nombre, user.apellido].filter(Boolean).join(' ') || user.email || 'Usuario'
        : 'Usuario';
    const navItems = [
        { to: ROUTES.RUTINAS, label: 'Ver rutinas' },
        { to: ROUTES.TURNOS, label: 'Ver turnos' },
    ];
    const isProfessional =
        user?.rol?.toString() === 'ROLE_PROFESIONALES' ||
        user?.rol?.toString() === '2';

    if (isProfessional) {
        navItems.push({ to: ROUTES.ACTIVIDADES, label: 'Ver mis actividades' });
    }

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate(ROUTES.HOME);
    }

    return (
        <header className="header-container">
            <Link to="/" className="home-logo-link" aria-label="Ir al inicio">
                <img className="home-logo" src="/logo2.png" alt="KinePro" />
            </Link>
            <nav className='btn-container nav-buttons' aria-label="Navegacion principal">
                {navItems.map((item) => (
                    <button
                        key={item.to}
                        type="button"
                        className={`btn-log nav-button${location.pathname === item.to ? ' is-active' : ''}`}
                        onClick={() => navigate(item.to)}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
            <div className='auth-container'>
                {!user && (
                    <button className='btn-log' onClick={() => navigate(ROUTES.INICIAR_SESION)}>Iniciar sesion</button>
                )}
                {user && user.rol === 'ROLE_ADMIN' && (
                    <button type="button" className="btn-gray" onClick={() => navigate(ROUTES.HISTORIAL_TURNOS)}>
                        Historial de turnos
                    </button>
                )}
                {user && (
                    <div className="user-menu">
                        <button
                            type="button"
                            className="user-icon-btn"
                            onClick={() => setMenuOpen((open) => !open)}
                            aria-label="Opciones de usuario"
                            aria-expanded={menuOpen}
                        >
                            <span className="user-icon">{user.nombre?.charAt(0)?.toUpperCase()}</span>
                        </button>
                        {menuOpen && (
                            <div className="user-dropdown">
                                <div className="user-dropdown-info">
                                    <span className="user-dropdown-name">{userDisplayName}</span>
                                    <span className="user-dropdown-role">{formatUserRole(user.rol)}</span>
                                </div>
                                {isAdmin && (
                                    <>
                                        <button className="dropdown-item" type="button" onClick={() => navigate(ROUTES.ADMINISTRAR_USUARIOS)}>
                                            Administrar usuarios
                                        </button>
                                        <button className="dropdown-item" type="button" onClick={() => navigate(ROUTES.VER_EMPLEADOS)}>
                                            Ver empleados
                                        </button>
                                    </>
                                )}
                                {canViewClinicPayments && (
                                    <button className="dropdown-item" type="button" onClick={() => navigate(ROUTES.HISTORIAL_PAGOS_CLINICA)}>
                                        Ver pagos de la clinica
                                    </button>
                                )}
                                <button className="dropdown-item" type="button" onClick={() => navigate(ROUTES.HISTORIAL_PAGOS)}>
                                    Ver historial de pagos
                                </button>
                                <button className="dropdown-item" type="button" onClick={() => navigate(ROUTES.MIS_TURNOS)}>
                                    Ver mis turnos
                                </button>
                                <button className="dropdown-item" type="button" onClick={() => navigate(ROUTES.PANEL_USUARIO)}>
                                    Editar mis datos
                                </button>
                                <button className="dropdown-item" type="button" onClick={handleLogout}>
                                    Cerrar sesion
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

        </header>
    )
}

export default Header;
