package com.AMDevs.inge2.controller;

import com.AMDevs.inge2.dto.PreferenceRequestDTO;
import com.AMDevs.inge2.dto.PagoClinicaPaginaDTO;
import com.AMDevs.inge2.dto.PagoHistorialDTO;
import com.AMDevs.inge2.entity.Usuario;
import com.AMDevs.inge2.service.MercadoPagoService;
import com.AMDevs.inge2.service.PagoService;
import com.mercadopago.resources.preference.Preference;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/api/pagos")
public class MercadoPagoController {
    @Autowired
    private MercadoPagoService mercadoPagoService;
    @Autowired
    private PagoService pagoService;

    @PostMapping("crear-preferencia")
    public ResponseEntity<String> crearPreferencia(@RequestBody PreferenceRequestDTO request) {
        try {
            Preference preference = mercadoPagoService.createPreference(request.getTipo(),request.getItemId(), request.getUsuarioId());
            return ResponseEntity.ok(preference.getId());
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear la preferencia.");
        }
    }

    @GetMapping("/historial")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PagoHistorialDTO>> obtenerHistorialPersonal(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        return ResponseEntity.ok(pagoService.obtenerHistorialPersonal(usuario.getEmail()));
    }

    @GetMapping("/historial-clinica")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SECRETARIA')")
    public ResponseEntity<PagoClinicaPaginaDTO> obtenerHistorialClinica(
            @RequestParam(defaultValue = "0") int pagina
    ) {
        return ResponseEntity.ok(pagoService.obtenerHistorialClinica(pagina));
    }

}
