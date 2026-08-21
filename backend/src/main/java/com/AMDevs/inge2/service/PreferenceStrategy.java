package com.AMDevs.inge2.service;

import com.mercadopago.client.preference.PreferenceItemRequest;

import java.util.Map;


public interface PreferenceStrategy {
    String getTipo();
    PreferenceItemRequest buildItem(Long itemId, Long idUsuario);
    Map<String,Object> buildMetadata(Long ItemId, Long usuarioId);
}
