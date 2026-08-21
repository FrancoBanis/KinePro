package com.AMDevs.inge2.service;

import com.AMDevs.inge2.entity.Turno;
import com.AMDevs.inge2.entity.Usuario;
import com.AMDevs.inge2.repository.TurnoRepository;
import com.AMDevs.inge2.repository.UsuarioRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TurnoWebhookStrategy implements WebhookStrategy{
    @Autowired
    private TurnoRepository turnoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public String getTipo() {
        return "turno";
    }

    @Override
    @Transactional
    public void procesarPago(Long itemId, Long usuarioId) {
        Usuario usuario = usuarioRepository
                .findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("No se encontro el usaurio"));
        Turno turno = turnoRepository
                .findById(itemId)
                .orElseThrow(() -> new RuntimeException("No se encontro el turno"));
          if (!turno.tienePaciente(usuario)) {
              turno.agregarPaciente(usuario, false);
              turnoRepository.save(turno);
           }
    }
}
