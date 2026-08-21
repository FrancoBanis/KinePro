package com.AMDevs.inge2.service;

import com.AMDevs.inge2.entity.ColaEsperaRutina;
import com.AMDevs.inge2.entity.Rutina;
import com.AMDevs.inge2.entity.Usuario;
import com.AMDevs.inge2.repository.ColaEsperaRutinaRepository;
import com.AMDevs.inge2.repository.RutinaRepository;
import com.AMDevs.inge2.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ColaEsperaRutinaServiceImpl implements ColaEsperaRutinaService {

    private final ColaEsperaRutinaRepository colaEsperaRepository;
    private final RutinaRepository rutinaRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;

    public ColaEsperaRutinaServiceImpl(ColaEsperaRutinaRepository colaEsperaRepository,
                                      RutinaRepository rutinaRepository,
                                      UsuarioRepository usuarioRepository,
                                      EmailService emailService) {
        this.colaEsperaRepository = colaEsperaRepository;
        this.rutinaRepository = rutinaRepository;
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public ColaEsperaRutina agregar(Long rutinaId, Long usuarioId) {
        if (estaEnCola(rutinaId, usuarioId)) {
            throw new RuntimeException("El usuario ya está en la cola de espera de la rutina");
        }
        Rutina rutina = rutinaRepository.findById(rutinaId)
                .orElseThrow(() -> new RuntimeException("Rutina no encontrada " + rutinaId));
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado " + usuarioId));

        ColaEsperaRutina ce = new ColaEsperaRutina(rutina, usuario);
        ce.setPosicionEnCola(colaEsperaRepository.countByRutinaId(rutinaId) + 1);
        ce.setAvisoEnviado(false);
        ce.setRespuestaUsuario(false);
        return colaEsperaRepository.save(ce);
    }

    @Override
    @Transactional
    public void salir(Long rutinaId, Long usuarioId) {
        colaEsperaRepository.deleteByRutinaIdAndUsuarioId(rutinaId, usuarioId);
    }

    @Override
    public void enviarAviso(Long rutinaId, Long usuarioId) {
        Optional<ColaEsperaRutina> ceOpt = colaEsperaRepository.findByRutinaIdAndUsuarioId(rutinaId, usuarioId);
        if (ceOpt.isPresent() && !ceOpt.get().getAvisoEnviado() && !ceOpt.get().getRespuestaUsuario()) {
            Usuario usuario = ceOpt.get().getUsuario();
            // Adaptamos la URL apuntando a la confirmación de Rutina en el frontend
            emailService.sendMessageMail(
                usuario.getEmail(),
                "Aviso de cupo de rutina http://localhost:5173/ConfirmarColaRutina/" + rutinaId + "/" + usuarioId
            );
        } else {
            throw new RuntimeException("El usuario no está en la cola de espera de la rutina");
        }
    }

@Override
@Transactional
public void intentarAvisarAlSiguiente(Long rutinaId) {
    try {
        Optional<ColaEsperaRutina> siguiente = colaEsperaRepository
                .findFirstByRutinaIdAndAvisoEnviadoFalseOrderByPosicionEnColaAsc(rutinaId);
        
        if (siguiente.isPresent()) {
            ColaEsperaRutina cola = siguiente.get();
            enviarAviso(rutinaId, cola.getUsuario().getId());
            cola.setAvisoEnviado(true);
            colaEsperaRepository.save(cola);
        }
    } catch (Exception e) {
        // Logueamos el error para enterarnos en la consola, pero NO lo relanzamos.
        // De esta manera, la transacción principal de cancelación de la rutina puede hacer COMMIT con éxito.
        System.err.println("CRITICAL: No se pudo avisar al siguiente usuario en la cola de espera de la rutina " 
                           + rutinaId + ". Motivo: " + e.getMessage());
    }
}
    @Override
    @Transactional
    public void recibirRespuesta(Long rutinaId, Long usuarioId, boolean respuesta) {
        Optional<ColaEsperaRutina> ceOpt = colaEsperaRepository.findByRutinaIdAndUsuarioId(rutinaId, usuarioId);
        if (ceOpt.isPresent()) {
            ColaEsperaRutina ce = ceOpt.get();
            ce.setRespuestaUsuario(respuesta);
            colaEsperaRepository.save(ce);
            if (!respuesta) {
                avisarAlSiguiente(rutinaId, ce.getPosicionEnCola());
            }
        } else {
            throw new RuntimeException("El usuario no está en la cola de espera para esta rutina");
        }
    }

    private void avisarAlSiguiente(Long rutinaId, int posicionActual) {
        Optional<ColaEsperaRutina> siguiente = colaEsperaRepository
                .findByRutinaIdAndPosicionEnCola(rutinaId, posicionActual + 1);
        
        if (siguiente.isPresent()) {
            ColaEsperaRutina sig = siguiente.get(); 
            enviarAviso(rutinaId, sig.getUsuario().getId());
            sig.setAvisoEnviado(true);
            colaEsperaRepository.save(sig);
        } else {
            System.out.println("No hay más usuarios en la cola para esta rutina.");
        }
    }

    @Override
    public Optional<ColaEsperaRutina> obtenerSiguiente(Long rutinaId) {
        return colaEsperaRepository.findFirstByRutinaIdOrderByIdAsc(rutinaId);
    }

    @Override
    @Transactional
    public Optional<ColaEsperaRutina> procesarSiguiente(Long rutinaId) {
        Optional<ColaEsperaRutina> proximo = obtenerSiguiente(rutinaId);
        proximo.ifPresent(ce -> colaEsperaRepository.delete(ce));
        return proximo;
    }

    @Override
    public int cantidad(Long rutinaId) {
        return colaEsperaRepository.countByRutinaId(rutinaId);
    }

    @Override
    public boolean estaEnCola(Long rutinaId, Long usuarioId) {
        return colaEsperaRepository.existsByRutinaIdAndUsuarioId(rutinaId, usuarioId);
    }

    @Override
    public List<ColaEsperaRutina> listar(Long rutinaId) {
        return colaEsperaRepository.findByRutinaIdOrderByIdAsc(rutinaId);
    }
}