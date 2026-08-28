import { Link } from "react-router-dom";
import { ROUTES } from "../constants/config";
import "./PagoResultado.css"; // <-- IMPORTA EL CSS AQUÍ

export function PagoFallido() {
  return (
    <div className="pago-resultado-container">
      <div className="pago-card">
        <div className="pago-icono error">
          <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>

        <h1 className="pago-titulo">Pago fallido</h1>
        <p className="pago-texto">Hubo un problema procesando tu pago. Por favor, revisá tus datos e intentá de nuevo.</p>

        <Link to={ROUTES.HOME} className="btn-pago btn-pago-error">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default PagoFallido;