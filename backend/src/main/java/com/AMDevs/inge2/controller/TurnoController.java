package com.AMDevs.inge2.controller;

import com.AMDevs.inge2.dto.ReembolsoRequestDTO;
import com.AMDevs.inge2.entity.Turno;
import com.AMDevs.inge2.repository.TurnoRepository;
import com.AMDevs.inge2.service.TurnoService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/turnos")
public class TurnoController {
    @Autowired
    private TurnoRepository repo;
    @Autowired
    private TurnoService service;
    private final TurnoService turnoService;

    public TurnoController(TurnoRepository repo, TurnoService turnoService) {
        this.repo = repo;
        this.turnoService = turnoService;
    }

    @GetMapping
    public ResponseEntity<?> listadoDeTurnosActivos() {
        try {
            return  ResponseEntity.ok(service.getTurnosActivos());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al recuperar los turnos "+ e.getMessage());
        }
    }
    @GetMapping("/todos")
    public ResponseEntity<?> listadoDeTodosLosTurnos() {
        try {
            return ResponseEntity.ok(service.getTurnos());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al recuperar todos los turnos " + e.getMessage());
        }
    }

    @GetMapping("/mis-turnos")
    public ResponseEntity<?> misTurnos(@RequestParam Long usuarioId) {
        try {
            return ResponseEntity.ok(repo.findTurnosByUsuarioId(usuarioId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al recuperar los turnos del usuario " + e.getMessage());
        }
    }
    @GetMapping("/mis-turnos-profesional")
    public ResponseEntity<?> misTurnosProfesional(@RequestParam Long usuarioId) {
        try {
            return ResponseEntity.ok(repo.findTurnosProfesionalesByUsuarioId(usuarioId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al recuperar los turnos del profesional " + e.getMessage());
        }
    }
    @GetMapping("/turnos-similares")
    public ResponseEntity<?> getTurnosSimilares(@RequestParam Long turnoId , @RequestParam Long usuarioId) {
        try {
            return ResponseEntity.ok(service.getTurnosSimilares(turnoId, usuarioId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al recuperar los turnos similares: " + e.getMessage());
        }
    }
    

    @GetMapping("/{turnoId}/pacientes/{usuarioId}")
    public ResponseEntity<Boolean> seEncuentraEnTurno(
        @PathVariable Long turnoId,
        @PathVariable Long usuarioId
    ) {
        boolean resultado = turnoService.seEncuentra(usuarioId, turnoId);
        return ResponseEntity.ok(resultado);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Turno> buscarPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(turnoService.buscarPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping
    public ResponseEntity<Turno> crear(@RequestBody Turno turno) {
        return ResponseEntity.ok(turnoService.crearTurno(turno));
    }
    @PostMapping("/{turnoId}/pacientes/{usuarioId}")
    public ResponseEntity<Turno> agregarPaciente(
            @PathVariable Long turnoId,
            @PathVariable Long usuarioId
    ) {
        return ResponseEntity.ok(turnoService.agregarPacienteAlTurno(turnoId, usuarioId));
    }
    @PostMapping("/{turnoId}/profesionales/{usuarioId}")
    public ResponseEntity<Turno> agregarProfesional(
            @PathVariable Long turnoId,
            @PathVariable Long usuarioId
    ) {
        return ResponseEntity.ok(turnoService.agregarProfesionalAlTurno(turnoId, usuarioId));
    }
        @GetMapping("/pago")
        public ResponseEntity<?> costo(@RequestParam  Long id) {
            try {
                return ResponseEntity.ok(service.costo(id));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error al calcular el costo total  "+ e.getMessage());
            }
    }
    @GetMapping("/calcular-reembolso")
    public ResponseEntity<ReembolsoRequestDTO> calcularReembolso (@RequestParam Long turnoId , @RequestParam Long usuarioId ) {
        return ResponseEntity.ok(turnoService.calcularReembolso(turnoId, usuarioId));
    }
    @DeleteMapping("/{turnoId}/pacientes/{usuarioId}")
    public ResponseEntity<Void> cancelarTurno (
        @PathVariable Long usuarioId,
        @PathVariable Long turnoId
    ) {
        turnoService.eliminarUsuarioDeTurno(usuarioId, turnoId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/reprogramar")
    public ResponseEntity<Void> reprogramarTurno (
        @RequestParam Long usuarioId, 
        @RequestParam Long turnoActId, 
        @RequestParam Long turnoNueId 
    ){
        turnoService.agregarPacienteAlTurno(turnoNueId, usuarioId);
        turnoService.eliminarUsuarioDeTurno(usuarioId, turnoActId);
        return ResponseEntity.noContent().build();
    }
}
