package com.AMDevs.inge2.service;

import com.AMDevs.inge2.dto.ReembolsoRequestDTO;
import com.AMDevs.inge2.entity.Rutina;
import com.AMDevs.inge2.entity.Turno;
import com.AMDevs.inge2.entity.Usuario;
import com.AMDevs.inge2.repository.TurnoRepository;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TurnoService {

    private final TurnoRepository turnoRepository;
    private final UsuarioService usuarioService;
    private final ColaEsperaTurnoService colaEsperaService;

    public TurnoService(TurnoRepository turnoRepository, UsuarioService usuarioService, ColaEsperaTurnoService colaEsperaService) {
        this.turnoRepository = turnoRepository;
        this.usuarioService = usuarioService;
        this.colaEsperaService = colaEsperaService;
    }

    public List<Turno> getTurnos() {
        return turnoRepository.findAll();
    }

    public List<Turno> getTurnosActivos() {
        return turnoRepository.findAll().stream().filter(t -> t.getActiva() != null && t.getActiva()).toList();
    }
    public Turno buscarPorId(Long id) {
        return turnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado"));
    }
    public List<Turno> getTurnosSimilares(Long id, Long idUsuario) {
        Turno turno = buscarPorId(id);
        Rutina rutinaDeTurno = buscarRutinaDeturno(id);
        
        List<Turno> turnosSimilares = new ArrayList<>();
        getTurnosActivos().forEach(t -> {
            if (turnoHabilitado(rutinaDeTurno.getCostoPorTurno(), turno, t) && !seEncuentra(idUsuario, t.getId())) {
                turnosSimilares.add(t);
            }
        });
        return turnosSimilares;
    }
    public boolean turnoHabilitado(double precio, Turno turno, Turno request) {
        return ((precio == costo(request.getId())) && (turno.getCantidadDePacientesActuales() < turno.getCupoMaxPacientes())); 
    }
    public Turno crearTurno(Turno turno) {
        return turnoRepository.save(turno);
    }
    
    public Turno actualizarTurno(Long id, Turno turno) {
        Turno existente = buscarPorId(id);

        existente.setNombre(turno.getNombre());
        existente.setFecha(turno.getFecha());
        existente.setHoraInicio(turno.getHoraInicio());
        existente.setHoraFin(turno.getHoraFin());
        existente.setCupoMaxPacientes(turno.getCupoMaxPacientes());
        existente.setRutina(turno.getRutina());

        return turnoRepository.save(existente);
    }

    public void eliminarTurno(Long id) {
        turnoRepository.deleteById(id);
    }

    
    public Turno agregarPacienteAlTurno(Long turnoId, Long usuarioId) {
        return agregarPacienteAlTurno(turnoId, usuarioId, false);
    }

    // Cuando desdeRutina es true (el usuario se anoto a la rutina completa) la
    // inscripcion no se cuenta contra el cupo del turno y nunca se rechaza.
    public Turno agregarPacienteAlTurno(Long turnoId, Long usuarioId, boolean desdeRutina) {
        Turno turno = buscarPorId(turnoId);
        Usuario usuario = usuarioService.buscarPorId(usuarioId);

        if (!turno.tienePaciente(usuario)) {
            if (desdeRutina || turno.getCantidadDePacientesActuales() < turno.getCupoMaxPacientes()) {
                turno.agregarPaciente(usuario, desdeRutina);
            }
        }

        return turnoRepository.save(turno);
    }

    public Turno agregarProfesionalAlTurno(Long turnoId, Long usuarioId) {
        Turno turno = buscarPorId(turnoId);
        Usuario usuario = usuarioService.buscarPorId(usuarioId);
        if (!turno.getProfesionales().contains(usuario)) {
            turno.getProfesionales().add(usuario);
        }

        return turnoRepository.save(turno);
    }
    public Rutina buscarRutinaDeturno (Long id) {
        return buscarPorId(id).getRutina();
    }
    public double costo (Long id) {
        return buscarPorId(id).getRutina().getCostoPorTurno();
    }
    public ReembolsoRequestDTO calcularReembolso(Long turnoId , Long usuarioId) {
        Turno turno = buscarPorId(turnoId);
        LocalDateTime fechaTurno = LocalDateTime.of(turno.getFecha(), turno.getHoraInicio());
        LocalDateTime fechaActual = LocalDateTime.now();
        Long horasRestantes = Duration.between(fechaActual, fechaTurno).toHours();
        double costoOriginal =  costo(turnoId);
        if (horasRestantes < 24) {
            return new ReembolsoRequestDTO(
                true,
                0,
                costoOriginal,
                "No se reintegra dinero: se cancela con menos de 24 horas de antelación.");
        } else if (horasRestantes <= 48) {
            return new ReembolsoRequestDTO(
                true,
                costoOriginal * 0.5,
                costoOriginal, 
                "Reembolso del 50%");
        } else {
            return new ReembolsoRequestDTO(
                true,
                costoOriginal,
                costoOriginal, 
                "Reeembolso del 100%");
        }
    }
    public void eliminarUsuarioDeTurno(Long usuarioId, Long turnoId) {
        Usuario usuario = usuarioService.buscarPorId(usuarioId);
        Turno turno =  buscarPorId(turnoId);
        turno.quitarPaciente(usuario);
        turnoRepository.save(turno);
        colaEsperaService.intentarAvisarAlSiguiente(turnoId);
    }
    public boolean seEncuentra(Long usuarioId, Long turnoId) {
        Turno turno = buscarPorId(turnoId);
        return turno.getPacientes().stream().anyMatch(e -> e.getId().equals(usuarioId));
    }
}

    

