import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { iniciarSesion } from "../services/usuarioService";
import { ROUTES } from "../constants/config";
import { toast } from "sonner";

export function LoginPage() {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      iniciarSesion(email);
      navigate(ROUTES.VALIDAR_TOKEN, {
        state: {
          ...location.state,
          email,
        },
      });
    } catch (err) {
      toast.error("No se pudo enviar el token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Iniciar sesión</h2>

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">Email</label>

          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
