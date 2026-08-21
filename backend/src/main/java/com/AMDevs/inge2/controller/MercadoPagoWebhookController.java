package com.AMDevs.inge2.controller;


import com.AMDevs.inge2.service.MercadoPagoWebhookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/webhook")
public class MercadoPagoWebhookController {
        @Autowired
    private MercadoPagoWebhookService webhookService;

    @PostMapping("/mercadopago")
    public ResponseEntity<String> recibirRespuesta(@RequestBody Map<String,Object> body) {
        System.out.println("Webhook recibido: " + body);
        String tipo = (String) body.get("type");
        if ("payment".equals(tipo)) {
            Map<String, Object> data = (Map<String, Object>) body.get("data");
            String paymentId = data.get("id").toString();
            webhookService.procesarPago(paymentId);
        }
        return ResponseEntity.ok("200");
    }

}
