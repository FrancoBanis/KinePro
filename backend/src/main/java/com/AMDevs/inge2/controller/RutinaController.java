package com.AMDevs.inge2.controller;

import com.AMDevs.inge2.dto.RutinaRequestDTO;
import com.AMDevs.inge2.entity.Rutina;
import com.AMDevs.inge2.entity.Turno;
import com.AMDevs.inge2.entity.Usuario;
import com.AMDevs.inge2.repository.RutinaRepository;
import com.AMDevs.inge2.service.EmailService;
import com.AMDevs.inge2.service.RutinaService;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.time.DayOfWeek;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rutinas")
public class RutinaController {
    private final EmailService emailService;
    private final RutinaService rutinaService;
    public RutinaController(RutinaRepository repo, RutinaService rutinaService, EmailService emailService) {
        this.rutinaService = rutinaService;
        this.emailService = emailService;
    }
    
    @GetMapping("/pago/calcular")
    public ResponseEntity<?> costoTotal(@RequestParam Long id, @RequestParam Long idUsuario) {
        try {
             return ResponseEntity.ok(rutinaService.costoTotalRutina(id,idUsuario));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al calcular el costo total  "+ e.getMessage());
        }
    }
    @GetMapping("/mis-rutinas/contar")
    public ResponseEntity<?> contarMisRutinas(@RequestParam Long id, @RequestParam Long idUsuario) {
        try {
            Rutina rutina = rutinaService.buscarRutina(id);
            return ResponseEntity.ok(rutinaService.contarMisTurnos(rutina, idUsuario));
        } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al contar las rutinas:  "+ e.getMessage());
        }
    }
    @GetMapping("/disponibilidad")
    public ResponseEntity<?> contarRutinas(@RequestParam Long id, @RequestParam Long idUsuario) {
        try {
            Rutina rutina = rutinaService.buscarRutina(id);
            return ResponseEntity.ok(rutinaService.rutinaHabilitada(rutina));
        } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al contar las rutinas:  "+ e.getMessage());
        }
    }
    @GetMapping("/rutinas-similares")
    public ResponseEntity<?> getRutinasSimilares(@RequestParam Long idRutina, @RequestParam Long idUsuario) {
        try {
            return ResponseEntity.ok(rutinaService.getRutinasSimilares(idRutina, idUsuario));
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al recuperar las rutinas similares: " + e.getMessage());
        }
    }
    @PostMapping("/{idRutina}/reprogramar/{idRutinaNueva}/usuarios/{idUsuario}")
    public ResponseEntity<?> reprogramarRutina(
        @PathVariable Long idRutina,
        @PathVariable Long idRutinaNueva,
        @PathVariable Long idUsuario) {
        try {
            rutinaService.reprogramarRutina(idUsuario, idRutina, idRutinaNueva);
            return ResponseEntity.ok(Map.of("message", "Rutina reprogramada con éxito"));
    }   catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @GetMapping("/{idRutina}/usuarios/{idUsuario}")
    public ResponseEntity<Boolean> seEncuentraEnLaRutina(@PathVariable Long idRutina,@PathVariable Long idUsuario) {
        boolean resultado = rutinaService.seEncuentraEnLaRutina(idUsuario, idRutina);
        return ResponseEntity.ok(resultado);
    }
    @GetMapping("/mis-rutinas")
    public ResponseEntity<List<Rutina>> getMisRutinas (@RequestParam Long idUsuario) {
        return ResponseEntity.ok(rutinaService.getMisRutinas(idUsuario));
    }
    @GetMapping("/mis-rutinas/turnos")
    public ResponseEntity<List<Turno>> getTurnosDeMisRutinas (@RequestParam Long idRutina, @RequestParam Long idUsuario) {
        return ResponseEntity.ok(rutinaService.getTurnosDeMisRutinas(idUsuario, idRutina));
    }
    @GetMapping
    public ResponseEntity<List<Rutina>> listarTodas() {
        return ResponseEntity.ok(rutinaService.getRutinas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rutina> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(rutinaService.buscarRutina(id));
    }

    @GetMapping("/activa/{activa}")
    public ResponseEntity<List<Rutina>> listarPorActiva(@PathVariable Boolean activa) {
        return ResponseEntity.ok(rutinaService.listarPorActiva(activa));
    }

    @GetMapping("/dia/{diaSemana}")
    public ResponseEntity<List<Rutina>> listarPorDiaSemana(@PathVariable DayOfWeek diaSemana) {
        return ResponseEntity.ok(rutinaService.listarPorDiaSemana(diaSemana));
    }

    @GetMapping(params = {"tipoRutinaId"})
    public ResponseEntity<?> listarPorTipoYActivas(
            @RequestParam(required = false) Boolean activa,
            @RequestParam(required = false) Long tipoRutinaId) {
        try {
            return ResponseEntity.ok(rutinaService.listarActivasPorTipo(tipoRutinaId, activa));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @PostMapping ("/admin")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SECRETARIA')")
    public ResponseEntity<Rutina> crear(@RequestBody RutinaRequestDTO request) {
        return ResponseEntity.ok(rutinaService.crearRutina(request));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SECRETARIA')")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody RutinaRequestDTO request) {
       try { 
            rutinaService.actualizarRutina(id, request); 
            return ResponseEntity.ok(Map.of("message","Modificacion Exitosa"));
       } catch (Exception e) { 
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
       }
        
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SECRETARIA')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        rutinaService.eliminarRutina(id);
        return ResponseEntity.noContent().build();
    }
    @DeleteMapping("/{idRutina}/usuarios/{idUsuario}")
    public ResponseEntity<Void> cancelarRutina (@PathVariable Long idUsuario, @PathVariable Long idRutina) {
        rutinaService.eliminarUsuarioDeRutina(idUsuario, idRutina);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{idRutina}/usuarios/{idUsuario}")
    public ResponseEntity<?> anotarseARutina (@PathVariable Long idUsuario, @PathVariable Long idRutina) {
        try {
            rutinaService.inscribirUsuarioEnRutina(idUsuario, idRutina);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/admin/{id}/activar")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SECRETARIA')")
    public ResponseEntity<Rutina> activar(@PathVariable Long id) {
        return ResponseEntity.ok(rutinaService.activarRutina(id));
    }

    @PatchMapping("/admin/{id}/desactivar")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SECRETARIA')")
    public ResponseEntity<Rutina> desactivar(@PathVariable Long id) {
        return ResponseEntity.ok(rutinaService.desactivarRutina(id));
    }

    @PostMapping("/admin/{id}/enviar-aviso")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SECRETARIA')")
    public ResponseEntity<?> enviarAviso(@PathVariable Long id, @RequestBody EnviarAvisoRequest request) {
        try {
                Rutina rutina = rutinaService.buscarRutina(id);
               Set<String> emailsEnviados = new HashSet<>(); // hash set que uso solo para no repetir el envio del mail 
                    // (si mando a un paciente una vez ya lo meto aca y no se vuelve a enviar)

                for (Turno turno : rutina.getTurnos()) { 
                    for (Usuario paciente : turno.getPacientes()) {
                        if (emailsEnviados.add(paciente.getEmail())) { // devuelve true si el elemento no estaba
                            emailService.sendMessageMail(paciente.getEmail(),request.mensaje);
                        }
                    }
                }
                return ResponseEntity.ok(Map.of("message", "Aviso enviado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error al enviar aviso: " + e.getMessage()));
        }
    }
    
    private record EnviarAvisoRequest(String mensaje) {}
}
