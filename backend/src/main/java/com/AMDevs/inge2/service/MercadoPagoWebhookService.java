package com.AMDevs.inge2.service;


import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.resources.payment.Payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class MercadoPagoWebhookService {
    @Autowired
    private List<WebhookStrategy> strategies;
    @Autowired
    private PagoService pagoService;

    @Transactional
    public void procesarPago (String paymentId) {
        System.out.println("Procesando pago: " + paymentId);
        try {
            PaymentClient client = new PaymentClient();
            Payment payment = client.get(Long.parseLong(paymentId));
            if ("approved".equals(payment.getStatus())) {
                if (pagoService.existePorMercadoPagoId(payment.getId())) return;

                Map<String, Object> metadata = payment.getMetadata();
                String tipo = metadata.get("tipo").toString();
                Long itemId = ((Number) metadata.get(tipo + "_id")).longValue();
                Long usuarioId =((Number) metadata.get("usuario_id")).longValue(); 

            strategies.stream()
                    .filter(s -> s.getTipo().equals(tipo))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Error al encontrar el tipo "+ tipo))
                    .procesarPago(itemId,usuarioId);

                pagoService.registrarPago(
                        payment.getId(),
                        usuarioId,
                        tipo,
                        itemId,
                        payment.getTransactionAmount(),
                        payment.getDateApproved()
                );
            }

        }  catch (MPApiException e) {
            throw new RuntimeException("Hubo un error procesando el pago: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Hubo un error procesando el pago: " + e.getMessage());
    }
    
    }
}
