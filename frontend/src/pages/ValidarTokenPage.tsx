import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocationState } from "../components/hooks/useLocationState";
import { ROUTES } from "../constants/config";
import { verificarToken } from "../services/usuarioService";

function ValidarToken() {
  const location = useLocation();
  const navigate = useNavigate();

  const { setUser } = useAuth();
  const { typedState } = useLocationState();

  const from = typedState?.from || ROUTES.HOME;
  const email = location.state?.email || "";

  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const res = await verificarToken(email,token);
      if (res.data.registered === false) {
        navigate(ROUTES.REGISTRO, {
          state: {
            email,
            ...location.state,
          },
        });

        return;
      }

      setUser(res.data);

      navigate(from, {
        state: {
          from,
          abrirItemId: typedState?.abrirItemId,
          tipo: typedState?.tipo,
        },
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data?.message ||
            "Token inválido"
        );
      } else {
        setError("Error al conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Validar Token</h2>

      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Token</label>

          <input
            type="text"
            className="form-control"
            value={token}
            onChange={e => setToken(e.target.value)}
            required
          />
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Validando..." : "Validar"}
        </button>
      </form>
    </div>
  );
}

export default ValidarToken;
