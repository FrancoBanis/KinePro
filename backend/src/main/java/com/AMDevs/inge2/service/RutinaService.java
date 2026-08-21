package com.AMDevs.inge2.service;

import com.AMDevs.inge2.dto.RutinaRequestDTO;
import com.AMDevs.inge2.entity.Rutina;
import com.AMDevs.inge2.entity.Turno;

import java.time.DayOfWeek;
import java.util.List;

public interface RutinaService {
    List<Rutina> getRutinas();
    List<Rutina> getMisRutinas(Long idUsuario);
    List<Turno> getTurnosDeMisRutinas (Long idUsuario , Long idRutina); 
    List<Rutina> getRutinasSimilares (Long id, Long idUsuario);
    Rutina crearRutina(RutinaRequestDTO request);
    Rutina actualizarRutina(Long id, RutinaRequestDTO request);
    void eliminarRutina(Long id);
    Rutina activarRutina(Long id);
    Rutina desactivarRutina(Long id);
    List<Rutina> listarPorActiva(Boolean activa);
    List<Rutina> listarPorDiaSemana(DayOfWeek diaSemana);
    void eliminarUsuarioDeRutina(Long idUsuario, Long idRutina);
    void inscribirUsuarioEnRutina(Long idUsuario, Long idRutina);
    void reprogramarRutina(Long idUsuario, Long idRutinaActual, Long idRutinaNueva);
    // Additional helpers used elsewhere
    Rutina buscarRutina(Long id);
    double costoTotalRutina(Long id, Long idUsuario);
    Long contarTurnos(Rutina rutina,Long idUsuario);
     Long contarMisTurnos(Rutina rutina, Long idUsuario); 
    // List<Turno> listarTurnosDisponibles(Long id);
    List<Rutina> listarActivasPorTipo(Long tipoRutinaId, Boolean activa);
    boolean seEncuentraEnLaRutina(Long idUsuario , Long idRutina);
}


