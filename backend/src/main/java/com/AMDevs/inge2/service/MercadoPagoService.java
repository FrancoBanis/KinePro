package com.AMDevs.inge2.service;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class MercadoPagoService {
    @Value("${mercadopago.access-token}")
    private String accessToken;
    @Value("${app.frontend-url}")
    private String frontendUrl;

    PreferenceClient client = new PreferenceClient();

    @Autowired
    private List<PreferenceStrategy> strategies;
    @PostConstruct
    public void init(){
        MercadoPagoConfig.setAccessToken(accessToken);
    }

    public Preference createPreference(String tipo , Long itemId, Long usuarioId) {
        PreferenceStrategy strategy = strategies.stream()
                .filter(s -> s.getTipo().equals(tipo))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Tipo no reconocido" + tipo ));
        
        PreferenceItemRequest item = strategy.buildItem(itemId,usuarioId);
        Map<String,Object> metadata = strategy.buildMetadata(itemId,usuarioId);
        return buildAndCreatePreference(item,metadata);
    }

    public Preference buildAndCreatePreference(PreferenceItemRequest item , Map<String, Object> metadata) {
        String normalizedFrontendUrl = frontendUrl.endsWith("/")
            ? frontendUrl.substring(0, frontendUrl.length() - 1)
            : frontendUrl;
        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
            .success(normalizedFrontendUrl + "/pago-exitoso")
            .failure(normalizedFrontendUrl + "/pago-fallido")
            .build();

        PreferenceRequest request= PreferenceRequest.builder()
                .items(List.of(item))
                .backUrls(backUrls)
                .autoReturn("approved")
                .purpose("wallet_purchase")
                .metadata(
                    metadata)
                .build();

        try {
            Preference preference = client.create(request);
            return preference;
        } catch (MPApiException e ) {
            System.err.println("Error de MP API: " + e.getApiResponse().getContent());
            throw new RuntimeException(e);
            
        } catch (MPException e) {
            System.err.println("Error de MP: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

}
