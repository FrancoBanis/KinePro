import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { TurnoData } from "../constants/shift";
import type { RutinaData } from "../constants/routines";
import { Turno } from "../components/Turno";
import { getMisRutinas, getTurnosDeMisRutinas } from "../services/rutinaService";
import { Rutina } from "../components/Rutina";
export function MisTurnosPage() {
  const { user } = useAuth();
  const [turnos, setTurnos] = useState<TurnoData[]>([]);
  const [rutinas, setRutinas] = useState<RutinaData[]>([]);

  useEffect(() => {
    const cargarRutinasConTurnos = async () => {
      if (!user?.id) return;
      try {
        const rutinasData = await getMisRutinas(user.id);
        const rutinasConTurno = await Promise.all(
          rutinasData.map(async (rutina: { id: number; }) => {
            const turnosData = await getTurnosDeMisRutinas(user.id!,rutina.id);
            return{...rutina, turnos: turnosData}
          }))
          setRutinas(rutinasConTurno);
        } catch(error) {
          console.error(error);
        }};
    cargarRutinasConTurnos();
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
      <div className="row g-4" >
        {rutinas.map((rutina) => {
            return (
              <div className="col-12" key={rutina.id}>
                <div className="border rounded p-3">
                <Rutina rutinaRecibida={rutina} modo={'misTurnos'}/>
                <div className="row g-3 mt-2">
                {rutina.turnos.map((turno) => {
                  return (
                  <div className="col-12 col-md-6 col-lg-4" key={turno.id}>
                  <Turno turnoRecibido={turno} modo={'misTurnos'} />
                  </div>
                  )
                
                })}
                </div>
              </div>
              </div>
            )
          }
        )}
      </div>

    </section>
  );
}

export default MisTurnosPage;
