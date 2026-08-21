import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocationState } from "../constants/useLocationState";
import { calcularEdad, obtenerLimitesFechaNacimiento } from "../utils/formateador";

const limitesFechaNacimiento = obtenerLimitesFechaNacimiento();

interface RegisterForm {
  email: string;
  nombre: string;
  fechaNacimiento: string;
  apellido?: string;
  dni?: number;
}

interface RegisterProps {
  email?: string;
}

function Register({ email = "" }: RegisterProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const { setUser } = useAuth();
  const { typedState } = useLocationState();
  const from = typedState?.from || "/";
  const email_1 = location.state?.email || "";

  const [form, setForm] = useState<RegisterForm>({
    email,
    nombre: "",
    fechaNacimiento: "",
    apellido: "",
    dni: 0,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError(null);

    if (calcularEdad(form.fechaNacimiento) < 13) {
      setError(
        "Error: Edad inválida. La edad mínima es 13 años."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/complete-registration",
        form,
        {
          withCredentials: true,
        }
      );

      setUser(res.data);

      navigate(from, {
        state: {
          from,
          abrirItemId: typedState?.abrirItemId,
          tipo: typedState?.tipo,
        },
      });
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data?.message ||
            "Error al registrar usuario"
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
      <h2>Completar datos</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nombre</label>

          <input
            name="nombre"
            className="form-control"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Apellido</label>

          <input
            name="apellido"
            className="form-control"
            value={form.apellido}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Fecha de nacimiento</label>

          <input
            type="date"
            name="fechaNacimiento"
            className="form-control"
            value={form.fechaNacimiento}
            onChange={handleChange}
            min={limitesFechaNacimiento.min}
            max={limitesFechaNacimiento.max}
            required
          />
        </div>

        <div className="mb-3">
          <label>DNI</label>

          <input
            type="number"
            name="dni"
            className="form-control"
            value={form.dni}
            onChange={handleChange}
            required
          />
        </div>

        <button
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar"}
        </button>

        {error && (
          <div className="alert alert-danger mt-2">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}

export default Register;
