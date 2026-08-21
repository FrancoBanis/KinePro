package com.AMDevs.inge2.service;

import com.AMDevs.inge2.entity.Rutina;
import com.AMDevs.inge2.entity.Turno;
import com.mercadopago.client.preference.PreferenceItemRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;

@Component
public class TurnoPreferenceStrategy implements PreferenceStrategy{

    @Autowired
    private TurnoService turnoService;
    public String getTipo() {
        return "turno";
    }
    public PreferenceItemRequest buildItem(Long itemId, Long idUsuario) {
        Turno turno = turnoService.buscarPorId(itemId);
        Rutina rutinaDeturno = turnoService.buscarRutinaDeturno(itemId);
        double precio = rutinaDeturno.getCostoPorTurno();

        return PreferenceItemRequest
                .builder()
                .title("Turno")
                .description(
                        "Hora " + turno.getHora() +
                        "Dia: " + turno.getDia() +
                        "Perteneciente al a rutina: " + rutinaDeturno.getNombre()
                )
                .quantity(1)
                .unitPrice(new BigDecimal(precio))
                .build();
    }
    public Map<String, Object> buildMetadata(Long itemId, Long usuarioId) {
        return Map.of(
                "tipo", this.getTipo(),
                "turno_id", itemId,
                "usuario_id", usuarioId
        );
    }
}