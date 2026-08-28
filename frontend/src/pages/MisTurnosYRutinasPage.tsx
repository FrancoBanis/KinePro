import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { TurnoData } from "../constants/turno";
import type { RutinaData } from "../constants/rutina";
import { Turno } from "../components/Turno";
import { getMisRutinas, getTurnosDeMisRutinas } from "../services/rutinaService";
import { Rutina } from "../components/Rutina";
import "./MisTurnosYRutinas.css";

export function MisTurnosYRutinasPage() {
  const { user } = useAuth();
  const [rutinas, setRutinas] = useState<RutinaData[]>([]);

  const actualizarRutinasConTurnos = async () => {
    if (!user?.id) return;
    try {
      const rutinasData = await getMisRutinas(user.id);
      const rutinasConTurno = await Promise.all(
        rutinasData.map(async (rutina: { id: number }) => {
          const turnosData = await getTurnosDeMisRutinas(user.id!, rutina.id);
          return { ...rutina, turnos: turnosData };
        })
      );
      setRutinas(rutinasConTurno);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    actualizarRutinasConTurnos();
  }, [user?.id]);

  const totalTurnos = rutinas.reduce((acc, r) => acc + r.turnos.length, 0);

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Mis turnos</h1>
          <p className="text-muted mb-0">Estos son los turnos en los que estás inscripto.</p>
        </div>
      </div>

      {totalTurnos === 0 && (
        <div className="alert alert-secondary">No tenés turnos asignados todavía.</div>
      )}

      {rutinas.map((rutina) => (
        <div className="mtr-grupo" key={rutina.id}>
          <Rutina
            rutinaRecibida={rutina}
            modo={"misTurnos"}
            onCancelarRutina={actualizarRutinasConTurnos}
            onReprogramarRutina={actualizarRutinasConTurnos}
          />
          <div className="mtr-turnos-grid">
            {rutina.turnos.map((turno) => (
              <Turno
                key={turno.id}
                turnoRecibido={turno}
                modo={"misTurnos"}
                onCancelarTurno={actualizarRutinasConTurnos}
                onReprogramarTurno={actualizarRutinasConTurnos}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default MisTurnosYRutinasPage;
