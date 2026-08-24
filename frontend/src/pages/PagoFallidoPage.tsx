import { Link } from "react-router-dom";
import { ROUTES } from "../constants/config";
export function PagoFallido() {

  return (
    <div>
      <h1>Pago fallido</h1>
      <p>Hubo un problema con el pago. Intenta de nuevo.</p>
      <Link to={ROUTES.HOME}>Volver al inicio</Link>
    </div>
  );
}
