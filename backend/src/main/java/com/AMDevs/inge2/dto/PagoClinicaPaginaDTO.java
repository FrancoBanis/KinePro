package com.AMDevs.inge2.dto;

import java.util.List;

public record PagoClinicaPaginaDTO(
        List<PagoClinicaHistorialDTO> pagos,
        int paginaActual,
        int totalPaginas,
        long totalPagos
) {}
