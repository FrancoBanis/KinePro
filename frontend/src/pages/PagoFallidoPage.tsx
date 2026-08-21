import { Link } from "react-router-dom";

export function PagoFallido() {

  return (
    <div>
      <h1>Pago fallido</h1>
      <p>Hubo un problema con el pago. Intenta de nuevo.</p>
      <Link to="http://localhost:5173/">Volver al inicio</Link>
    </div>
  );
}
