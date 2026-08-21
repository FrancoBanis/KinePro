package com.AMDevs.inge2.service;

import com.AMDevs.inge2.dto.RutinaRequestDTO;
import com.AMDevs.inge2.entity.Rutina;
import com.AMDevs.inge2.entity.TipoRutina;
import com.AMDevs.inge2.entity.Turno;
import com.AMDevs.inge2.repository.RutinaRepository;
import com.AMDevs.inge2.repository.TurnoRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Service
public class RutinaServiceImpl implements RutinaService {

    private final RutinaRepository rutinaRepository;
    private final TurnoService turnoService;
    private final TipoRutinaService tipoRutinaService;
    private final ColaEsperaRutinaService colaEsperaRutinaService;
    public RutinaServiceImpl(RutinaRepository rutinaRepository, ColaEsperaRutinaService colaEsperaRutinaService,TurnoService turnoService, TurnoRepository turnoRepository, TipoRutinaService tipoRutinaService) {
        this.rutinaRepository = rutinaRepository;
        this.turnoService = turnoService;
        this.tipoRutinaService = tipoRutinaService;
        this.colaEsperaRutinaService = colaEsperaRutinaService;
    }

    @Override
    public List<Rutina> getRutinas() {
        return rutinaRepository.findAll();
    }
    @Override
    public List<Rutina> getMisRutinas(Long idUsuario) {
        return getRutinas()
            .stream()
            .filter(r -> seEncuentraEnLaRutina(idUsuario, r.getId())).toList();
    }
    @Override
    public List<Turno> getTurnosDeMisRutinas (Long idUsuario , Long idRutina) {
        return buscarRutina(idRutina)
            .getTurnos()
            .stream()
            .filter(t -> turnoService.seEncuentra(idUsuario, t.getId()))
            .toList();
    }
    @Override
    public Rutina buscarRutina(Long id) {
        return rutinaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rutina no encontrada " + id));
    }

    private void generarTurnos(Rutina rutina) { 
        LocalDate fechaActual = rutina.getFechaInicio();
        LocalDate fechaFin = rutina.getFechaFin();
        DayOfWeek diaObjetivo = rutina.getDiaSemana(); 
        
        while(!fechaActual.isAfter(fechaFin)) {
            if (fechaActual.getDayOfWeek() == diaObjetivo){
                Turno turno = new Turno();
                turno.setNombre(diaObjetivo.name());
                turno.setFecha(fechaActual);
                turno.setHoraInicio(rutina.getHoraInicio());
                turno.setHoraFin(rutina.getHoraFin());
                turno.setCupoMaxPacientes(rutina.getCupoMaxPacientesPorTurno());
                turno.setActiva(true);
                rutina.agregarTurno(turno);
            }
            fechaActual = fechaActual.plusDays(1);
        }

    }
    
    private void aplicarDatos(Rutina rutina, RutinaRequestDTO request) {
         if (request.getTipoRutinaId() != null) {
                TipoRutina tipo = tipoRutinaService.buscarTipoRutina(request.getTipoRutinaId());
        rutina.setTipo(tipo);
    }
        rutina.setNombre(request.getNombre());
        rutina.setNombresDeProfesionales(request.getNombresDeProfesionales());
        rutina.setDiaSemana(request.getDiaSemana());
        rutina.setFechaInicio(request.getFechaInicio());
        rutina.setFechaFin(request.getFechaFin());
        rutina.setHoraInicio(request.getHoraInicio());
        rutina.setHoraFin(request.getHoraFin());
        rutina.setCupoMaxPacientesPorTurno(request.getCupoMaxPacientesPorTurno());
        rutina.setCupoMaxRutina(request.getCupoMaxRutina());
        rutina.setCostoPorTurno(request.getCostoPorTurno());
        rutina.setActiva(request.getActiva());
    }
 

    @Override
    public Rutina crearRutina(RutinaRequestDTO request) {
        Rutina rutina = new Rutina();
        aplicarDatos(rutina, request);
        if (rutina.getActiva() == null) {
            rutina.setActiva(true);
        }
        generarTurnos(rutina);
        return rutinaRepository.save(rutina);
    }

//  private int obtenerNumeroDeTurnos(Rutina rutina) {
//     return rutina.getTurnos() == null ? 0 : rutina.getTurnos().size();
//  }  // comentado porque no se usa


    @Override
    public double costoTotalRutina(Long id, Long idUsuario) {
        Rutina rutina = buscarRutina(id);
        Long turnosDisponibles =  contarTurnos(rutina, idUsuario) ;
        return rutina.getCostoPorTurno() * turnosDisponibles;
    }
    @Override
    public Long contarTurnos(Rutina rutina,Long idUsuario) {
        return rutina.getTurnos().stream()
                .filter(t -> !turnoService.seEncuentra(idUsuario, t.getId()))
                .filter(t -> {
                    Integer actuales = t.getCantidadDePacientesActuales();
                    Integer cupo = t.getCupoMaxPacientes();
                    return actuales != null && cupo != null && actuales < cupo;
                })
                .count();

    }
    public List<Rutina> getRutinasSimilares (Long id, Long idUsuario) {
        Rutina rutina = buscarRutina(id);
        double costo = getCuantoGastoUsuario(rutina, idUsuario);
        return getRutinas()
            .stream()
            .filter(r -> 
                (costoTotalRutina(r.getId(), idUsuario) == costo) && (r.getActiva().equals(true)))
            .toList();
          
    }
    public double getCuantoGastoUsuario (Rutina rutina, Long idUsuario) {
        return contarMisTurnos(rutina, idUsuario) * rutina.getCostoPorTurno(); 
    }

     @Override
     public Long contarMisTurnos(Rutina rutina, Long idUsuario) {
               return rutina.getTurnos().stream()
                .filter(t -> turnoService.seEncuentra(idUsuario, t.getId()))
                .count();
     }

    // meto helpers para refactor despues vemos si los sacamos o no 
    private boolean cambioDiaSemana(Rutina existente, RutinaRequestDTO request) { 
        return !existente.getDiaSemana().equals(request.getDiaSemana());
    }

    private boolean cambioDeFechas(Rutina existente, RutinaRequestDTO request) { 
    return !existente.getFechaInicio().equals(request.getFechaInicio())
            || !existente.getFechaFin().equals(request.getFechaFin()); 
    }

    private boolean hayPacientesInscritos(Rutina rutina) {
        return rutina.getTurnos().stream()
            .anyMatch(t -> t.getPacientes() != null && !t.getPacientes().isEmpty());
    }

    private int maxPacientesEnUnTurno(Rutina rutina) {
    return rutina.getTurnos().stream()
            .mapToInt(t -> t.getPacientes() != null ? t.getPacientes().size() : 0)
            .max()
            .orElse(0);
    }

    private void evaluarCambios(Rutina existente, RutinaRequestDTO request){ 
        if (hayPacientesInscritos(existente)) { 
            if (cambioDiaSemana(existente, request)) { 
                throw new RuntimeException(
            "No se puede cambiar el día de la semana porque existen usuarios inscriptos en esta rutina");
            }
            if (cambioDeFechas(existente, request)) { 
                throw new RuntimeException(
            "No se pueden cambiar las fechas de la rutina porque existen usuarios inscriptos en esta rutina");
            }
            if (!request.getCupoMaxPacientesPorTurno().equals(existente.getCupoMaxPacientesPorTurno())
                && request.getCupoMaxPacientesPorTurno() < maxPacientesEnUnTurno(existente)) {
                throw new RuntimeException(
                "No se puede reducir el cupo porque existen turnos con más usuarios inscriptos que el cupo solicitado");
            }
            if (request.getCupoMaxRutina() != null
                && request.getCupoMaxRutina() < existente.getCantidadPacientesRutina()) {
                throw new RuntimeException(
                "No se puede reducir el cupo de la rutina porque hay más usuarios anotados a la rutina completa que el cupo solicitado");
            }
        }
    }

    @Override
    public Rutina actualizarRutina(Long id, RutinaRequestDTO request) {
        Rutina existente = rutinaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rutina no encontrada"));   

        evaluarCambios(existente, request);
        aplicarDatos(existente, request);

        for (Turno turno : existente.getTurnos()) {
            turno.setRutina(existente);
            turno.setHoraInicio(existente.getHoraInicio());
            turno.setHoraFin(existente.getHoraFin());
            turno.setCupoMaxPacientes(existente.getCupoMaxPacientesPorTurno());
            turno.setActiva(true);

        }
    return rutinaRepository.save(existente);
    }


    @Override
    public void eliminarRutina(Long id) {
        rutinaRepository.deleteById(id);
    }

    @Override
    public Rutina activarRutina(Long id) {
        Rutina rutina = rutinaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rutina no encontrada"));
        rutina.setActiva(true);
        return rutinaRepository.save(rutina);
    }

    @Override
    public Rutina desactivarRutina(Long id) { 
        Rutina rutina = rutinaRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Rutina no encontrada"));
        rutina.setActiva(false);
    for (Turno turno : rutina.getTurnos()) {
            turno.setActiva(false);
        
    }

    
    return rutinaRepository.save(rutina);
    }

    @Override
    public List<Rutina> listarPorActiva(Boolean activa) {
        return rutinaRepository.findByActiva(activa);
    }

    @Override
    public List<Rutina> listarPorDiaSemana(DayOfWeek diaSemana) {
        return rutinaRepository.findByDiaSemana(diaSemana);
    }

    @Override
    public List<Rutina> listarActivasPorTipo(Long tipoRutinaId, Boolean activa) {
        if (activa != null) {
            return rutinaRepository.findByTipoIdAndActiva(tipoRutinaId, activa);
        }
        return rutinaRepository.findByTipoId(tipoRutinaId);
    }


@Transactional
@Override
public void eliminarUsuarioDeRutina(Long idUsuario, Long idRutina) {
    Rutina rutina = buscarRutina(idRutina);
    
    if (rutina.getTurnos() != null) {
        rutina.getTurnos().forEach(t -> {
            if (turnoService.seEncuentra(idUsuario, t.getId())) {
                turnoService.eliminarUsuarioDeTurno(idUsuario, t.getId());
            }
        });
    }

    // Capturamos cualquier error de la cola para que no rompa la transacción principal
    try {
        colaEsperaRutinaService.intentarAvisarAlSiguiente(idRutina);
    } catch (Exception e) {
        // Logueás el error pero permitís que la transacción termine con éxito
        System.err.println("No se pudo avisar al siguiente en la cola: " + e.getMessage());
    }
}
@Transactional
@Override
public void reprogramarRutina(Long idUsuario, Long idRutinaActual, Long idRutinaNueva) {
        if (idRutinaActual.equals(idRutinaNueva)) {
            throw new RuntimeException("No se puede reprogramar a la misma rutina.");
        }

        Rutina nuevaRutina = buscarRutina(idRutinaNueva);

        // 1. Validar cupo de la nueva rutina antes de alterar nada
        if (nuevaRutina.getCupoMaxRutina() != null
                && nuevaRutina.getCantidadPacientesRutina() >= nuevaRutina.getCupoMaxRutina()) {
            throw new RuntimeException("La rutina de destino alcanzó su cupo máximo de inscriptos.");
        }

        // 2. Dar de baja de la rutina actual (libera los turnos correspondientes)
        eliminarUsuarioDeRutina(idUsuario, idRutinaActual);

        // 3. Inscribir en la nueva rutina
        inscribirUsuarioEnRutina(idUsuario, idRutinaNueva);
    }
    private boolean yaInscriptoEnRutina(Rutina rutina, Long idUsuario) {
        return rutina.getTurnos().stream()
                .flatMap(t -> t.getPacientesDesdeRutina().stream())
                .anyMatch(u -> u.getId().equals(idUsuario));
    }

    @Override
    public void inscribirUsuarioEnRutina (Long idUsuario, Long idRutina) {
        Rutina rutina = buscarRutina(idRutina);

        if (!yaInscriptoEnRutina(rutina, idUsuario)
                && rutina.getCupoMaxRutina() != null
                && rutina.getCantidadPacientesRutina() >= rutina.getCupoMaxRutina()) {
            throw new RuntimeException("La rutina alcanzó su cupo máximo de inscriptos.");
        }

        rutina.getTurnos().stream().forEach(t -> {
            if (!turnoService.seEncuentra(idUsuario, t.getId())) {
                turnoService.agregarPacienteAlTurno(t.getId(), idUsuario, true);
            }
        });
    }
    @Override
    public boolean seEncuentraEnLaRutina(Long idUsuario, Long idRutina) {
        Rutina rutina = buscarRutina(idRutina);
        return rutina.getTurnos().stream()
            .anyMatch(t -> turnoService.seEncuentra(idUsuario, t.getId()));
    }
}