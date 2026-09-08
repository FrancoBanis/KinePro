package com.AMDevs.inge2.controller;

import com.AMDevs.inge2.entity.TipoRutina;
import com.AMDevs.inge2.service.TipoRutinaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tipos-rutina")
public class TipoRutinaController {

    private final TipoRutinaService tipoRutinaService;

    public TipoRutinaController(TipoRutinaService tipoRutinaService) {
        this.tipoRutinaService = tipoRutinaService;
    }

    @GetMapping
    public ResponseEntity<List<TipoRutina>> listarTodos() {
        return ResponseEntity.ok(tipoRutinaService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoRutina> buscarPorId(@PathVariable Long id) {
        return tipoRutinaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SECRETARIA')")
    public ResponseEntity<?> crear(@RequestBody TipoRutina tipoRutina) {
        try {
            return ResponseEntity.ok(tipoRutinaService.crearTipoRutina(tipoRutina));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SECRETARIA')")
    public ResponseEntity<?> modificar(@PathVariable Long id, @RequestBody TipoRutina tipoRutina) {
        try {
            return ResponseEntity.ok(tipoRutinaService.modificarTipoRutina(id, tipoRutina));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SECRETARIA')")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            tipoRutinaService.eliminarTipoRutina(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
}
