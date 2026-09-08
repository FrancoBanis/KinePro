import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../constants/config";
import { toast } from "sonner";
import api from "../services/axiosInstance";

export function EditarDatosPage() {
    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();
    const email = user?.email ?? "";
    const [nombre, setNombre] = useState(user?.nombre ?? "");
    const [apellido, setApellido] = useState(user?.apellido ?? "");
    const [dni, setDni] = useState(user?.dni ? String(user.dni) : "");
    const [deactivateLoading, setDeactivateLoading] = useState(false);

    useEffect(() => {
        setNombre(user?.nombre ?? "");
        setApellido(user?.apellido ?? "");
        setDni(user?.dni ? String(user.dni) : "");
    }, [user]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();


        const dniNumber = Number(dni);
        if (!nombre.trim() || !apellido.trim() || Number.isNaN(dniNumber)) {
            toast.error("Completá nombre, apellido y DNI válidos.");
            return;
        }

        try {
            const response = await api.put(
                "http://localhost:8080/api/auth/users",
                {
                    nombre: nombre.trim(),
                    apellido: apellido.trim(),
                    dni: dniNumber,
                    email: user?.email,
                }
            );

            setUser(response.data);
            toast.success("Datos actualizados correctamente.");
        } catch (err) {
            toast.error("No se pudieron guardar los cambios.");
        }
    };

    const handleDeactivateAccount = async () => {
        if (!user?.id) return;
        if (!window.confirm("¿Desactivar tu cuenta? Vas a cerrar sesión y tus datos se conservarán.")) return;

        setDeactivateLoading(true);

        try {
            await api.patch(
                `http://localhost:8080/api/auth/users/me/desactivar`);
            toast.success("Cuenta desactivada correctamente.");
            logout();
            navigate(ROUTES.HOME);
            setDeactivateLoading(false);
        } catch (err) {
            toast.error("No se pudo desactivar la cuenta.");
            setDeactivateLoading(false);
        } finally {
            setDeactivateLoading(false);
        }
    };

    return (
        <section className="container mt-5">
            <h2>Editar mis datos</h2>
                <form className="mt-4" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="text"
                            className="form-control"
                            value={email}
                            disabled
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            value={nombre}
                            onChange={(event) => setNombre(event.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Apellido</label>
                        <input
                            type="text"
                            className="form-control"
                            value={apellido}
                            onChange={(event) => setApellido(event.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">DNI</label>
                        <input
                            type="number"
                            className="form-control"
                            value={dni}
                            onChange={(event) => setDni(event.target.value)}
                            required
                        />
                    </div>

                    <button className="btn btn-primary" type="submit">
                        Guardar cambios
                    </button>

                    <div className="mt-2 text-center">
                        <button
                            className="btn btn-danger"
                            type="button"
                            onClick={handleDeactivateAccount}
                            disabled={deactivateLoading}
                        >
                            {deactivateLoading ? "Desactivando..." : "Desactivar cuenta"}
                        </button>
                    </div>
                </form>
        </section>
    )
}
