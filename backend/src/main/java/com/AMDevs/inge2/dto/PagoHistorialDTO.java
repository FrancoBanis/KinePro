package com.AMDevs.inge2.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PagoHistorialDTO(
        Long idPago,
        LocalDateTime fecha,
        BigDecimal monto,
        String concepto
) {}
