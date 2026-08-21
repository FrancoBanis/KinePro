package com.AMDevs.inge2.service;

import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RutinaWebhookStrategy implements  WebhookStrategy{
    @Autowired
    private RutinaService rutinaService;

    @Override
    public String getTipo() {
        return "rutina";
    }
    @Override
    @Transactional
    public void procesarPago(Long itemId, Long usuarioId) {
        rutinaService.inscribirUsuarioEnRutina(usuarioId, itemId);
    }
}

