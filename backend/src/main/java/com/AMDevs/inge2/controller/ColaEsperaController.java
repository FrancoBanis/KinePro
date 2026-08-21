package com.AMDevs.inge2.controller;

import com.AMDevs.inge2.entity.ColaEsperaTurno;
import com.AMDevs.inge2.service.ColaEsperaTurnoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cola-espera")
@CrossOrigin(origins = "http://localhost:5173")
public class ColaEsperaController {

    private final ColaEsperaTurnoService colaEsperaService;

    public ColaEsperaController(ColaEsperaTurnoService colaEsperaService) {
        this.colaEsperaService = colaEsperaService;
    }

    @PostMapping("/{turnoId}/usuario/{usuarioId}")
    public ResponseEntity<?> agregar(@PathVariable Long turnoId, @PathVariable Long usuarioId) {
        try {
            ColaEsperaTurno ce = colaEsperaService.agregar(turnoId, usuarioId);
            return ResponseEntity.ok(ce);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    @PostMapping("/{turnoId}/usuario/{usuarioId}/enviar-aviso")
    public ResponseEntity<Void> enviarAviso(@PathVariable Long turnoId, @PathVariable Long usuarioId) {
        colaEsperaService.enviarAviso(turnoId, usuarioId);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/{turnoId}/usuario/{usuarioId}/recibir-respuesta")
    public ResponseEntity<Void> recibirRespuesta(
        @PathVariable Long turnoId, 
        @PathVariable Long usuarioId, 
        @RequestParam boolean respuesta) {
        colaEsperaService.recibirRespuesta(turnoId, usuarioId, respuesta);
        return ResponseEntity.noContent().build();
    }
    @DeleteMapping("/{turnoId}/usuario/{usuarioId}")
    public ResponseEntity<Void> salir(@PathVariable Long turnoId, @PathVariable Long usuarioId) {
        colaEsperaService.salir(turnoId, usuarioId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{turnoId}/siguiente")
    public ResponseEntity<?> obtenerSiguiente(@PathVariable Long turnoId) {
        return colaEsperaService.obtenerSiguiente(turnoId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PostMapping("/{turnoId}/procesar-siguiente")
    public ResponseEntity<?> procesarSiguiente(@PathVariable Long turnoId) {
        return colaEsperaService.procesarSiguiente(turnoId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/{turnoId}/cantidad")
    public ResponseEntity<Integer> cantidad(@PathVariable Long turnoId) {
        return ResponseEntity.ok(colaEsperaService.cantidad(turnoId));
    }

    @GetMapping("/{turnoId}/usuario/{usuarioId}")
    public ResponseEntity<Boolean> estaEnCola(@PathVariable Long turnoId, @PathVariable Long usuarioId) {
        return ResponseEntity.ok(colaEsperaService.estaEnCola(turnoId, usuarioId));
    }

    @GetMapping("/{turnoId}")
    public ResponseEntity<List<ColaEsperaTurno>> listar(@PathVariable Long turnoId) {
        return ResponseEntity.ok(colaEsperaService.listar(turnoId));
    }
}
