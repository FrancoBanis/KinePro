import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { iniciarSesion } from "../services/usuarioService";
import { ROUTES } from "../constants/config";

export function LoginPage() {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
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
      setError("No se pudo enviar el token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Iniciar sesión</h2>

      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

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
