package com.AMDevs.inge2.service;

import com.AMDevs.inge2.entity.Rutina;
import com.mercadopago.client.preference.PreferenceItemRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;
@Component
public class RutinaPreferenceStrategy implements PreferenceStrategy {

    @Autowired
    private RutinaService rutinaService;

    public String getTipo() {
        return "rutina";
    };


    public PreferenceItemRequest buildItem(Long itemId, Long idUsuario) {
        Rutina rutina = rutinaService.buscarRutina(itemId);
        double precio = rutinaService.costoTotalRutina(itemId, idUsuario);
        return PreferenceItemRequest
                .builder()
                .title("Rutina: " + rutina.getNombre())
                .quantity(1)
                .unitPrice(new BigDecimal(precio))
                .build();
    }

    public Map<String ,Object> buildMetadata(Long itemId, Long usuarioId) {
        return Map.of(
                "tipo", this.getTipo(),
                "rutina_id", itemId,
                "usuario_id", usuarioId
        );
    }
}
