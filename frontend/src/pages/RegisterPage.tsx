import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocationState } from "../components/hooks/useLocationState";
import { calcularEdad, obtenerLimitesFechaNacimiento } from "../utils/formateador";
import { ROUTES } from "../constants/config";
import { toast } from "sonner";
import api from "../services/axiosInstance";
import type { RegisterForm, RegisterProps } from "../constants/usuarioData";
import { registrarUsuario } from "../services/administrarUsuarios";

const limitesFechaNacimiento = obtenerLimitesFechaNacimiento();




function Register({ email = "" }: RegisterProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const { setUser, setToken } = useAuth();
  const { typedState } = useLocationState();
  const from = typedState?.from || ROUTES.HOME;
  const email_1 = location.state?.email || "";

  const [form, setForm] = useState<RegisterForm>({
    email,
    nombre: "",
    fechaNacimiento: "",
    apellido: "",
    dni: 0,
  });

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

    if (calcularEdad(form.fechaNacimiento) < 13) {
      toast.error("Error: Edad inválida. La edad mínima es 13 años.");
      return;
    }

    setLoading(true);

    try {
      const res = await registrarUsuario(form);
      setToken(res.data.token);
      setUser(res.data.user);
      navigate(from, {
        state: {
          from,
          abrirItemId: typedState?.abrirItemId,
          tipo: typedState?.tipo,
        },
      });
      toast.success("Registro completado con éxito.");
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(
          err.response.data?.message ||
            "Error al completar el registro."
        );
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
      </form>
    </div>
  );
}

export default Register;


