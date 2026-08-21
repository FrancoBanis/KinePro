package com.AMDevs.inge2.controller;

import com.AMDevs.inge2.entity.ColaEsperaRutina;
import com.AMDevs.inge2.service.ColaEsperaRutinaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cola-espera-rutina")
@CrossOrigin(origins = "http://localhost:5173")
public class ColaEsperaRutinaController {

    private final ColaEsperaRutinaService colaEsperaService;

    public ColaEsperaRutinaController(ColaEsperaRutinaService colaEsperaService) {
        this.colaEsperaService = colaEsperaService;
    }

    @PostMapping("/{rutinaId}/usuario/{usuarioId}")
    public ResponseEntity<?> agregar(@PathVariable Long rutinaId, @PathVariable Long usuarioId) {
        try {
            ColaEsperaRutina ce = colaEsperaService.agregar(rutinaId, usuarioId);
            return ResponseEntity.ok(ce);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{rutinaId}/usuario/{usuarioId}/enviar-aviso")
    public ResponseEntity<Void> enviarAviso(@PathVariable Long rutinaId, @PathVariable Long usuarioId) {
        colaEsperaService.enviarAviso(rutinaId, usuarioId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{rutinaId}/usuario/{usuarioId}/recibir-respuesta")
    public ResponseEntity<Void> recibirRespuesta(
            @PathVariable Long rutinaId, 
            @PathVariable Long usuarioId, 
            @RequestParam boolean respuesta) {
        colaEsperaService.recibirRespuesta(rutinaId, usuarioId, respuesta);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{rutinaId}/usuario/{usuarioId}")
    public ResponseEntity<Void> salir(@PathVariable Long rutinaId, @PathVariable Long usuarioId) {
        colaEsperaService.salir(rutinaId, usuarioId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{rutinaId}/siguiente")
    public ResponseEntity<?> obtenerSiguiente(@PathVariable Long rutinaId) {
        return colaEsperaService.obtenerSiguiente(rutinaId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PostMapping("/{rutinaId}/procesar-siguiente")
    public ResponseEntity<?> procesarSiguiente(@PathVariable Long rutinaId) {
        return colaEsperaService.procesarSiguiente(rutinaId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/{rutinaId}/cantidad")
    public ResponseEntity<Integer> cantidad(@PathVariable Long rutinaId) {
        return ResponseEntity.ok(colaEsperaService.cantidad(rutinaId));
    }

    @GetMapping("/{rutinaId}/usuario/{usuarioId}")
    public ResponseEntity<Boolean> estaEnCola(@PathVariable Long rutinaId, @PathVariable Long usuarioId) {
        return ResponseEntity.ok(colaEsperaService.estaEnCola(rutinaId, usuarioId));
    }

    @GetMapping("/{rutinaId}")
    public ResponseEntity<List<ColaEsperaRutina>> listar(@PathVariable Long rutinaId) {
        return ResponseEntity.ok(colaEsperaService.listar(rutinaId));
    }
}