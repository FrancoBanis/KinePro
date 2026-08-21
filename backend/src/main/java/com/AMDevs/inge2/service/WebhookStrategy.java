package com.AMDevs.inge2.service;

public interface WebhookStrategy {
    String getTipo();
    void procesarPago (Long itemId, Long usuarioId);
}
