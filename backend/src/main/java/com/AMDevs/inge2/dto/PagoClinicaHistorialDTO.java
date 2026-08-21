package com.AMDevs.inge2.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PagoClinicaHistorialDTO(
        Long idPago,
        String nombreUsuario,
        String correoUsuario,
        BigDecimal monto,
        String nombreRutina,
        LocalDateTime fecha
) {}
