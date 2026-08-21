package com.AMDevs.inge2.service;

import com.AMDevs.inge2.entity.ColaEsperaTurno;
import com.AMDevs.inge2.entity.Rutina;
import com.AMDevs.inge2.entity.Turno;
import com.AMDevs.inge2.entity.Usuario;
import com.AMDevs.inge2.repository.ColaEsperaTurnoRepository;
import com.AMDevs.inge2.repository.RutinaRepository;
import com.AMDevs.inge2.repository.TurnoRepository;
import com.AMDevs.inge2.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ColaEsperaTurnoServiceImpl implements ColaEsperaTurnoService {

    private final ColaEsperaTurnoRepository colaEsperaRepository;
    private final TurnoRepository turnoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService; 
    public ColaEsperaTurnoServiceImpl(ColaEsperaTurnoRepository colaEsperaRepository,
                                  TurnoRepository turnoRepository,
                                  UsuarioRepository usuarioRepository,
                                EmailService emailService) {
        this.colaEsperaRepository = colaEsperaRepository;
        this.turnoRepository = turnoRepository;
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public ColaEsperaTurno agregar(Long turnoId, Long usuarioId) {
        if (estaEnCola(turnoId, usuarioId)) {
            throw new RuntimeException("El usuario ya está en la cola de espera");
        }
        Turno turno = turnoRepository.findById(turnoId)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado " + turnoId));
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado " + usuarioId));
        ColaEsperaTurno ce = new ColaEsperaTurno(turno, usuario);
        ce.setPosicionEnCola(colaEsperaRepository.countByTurnoId(turnoId) + 1);
        ce.setAvisoEnviado(false);
        ce.setRespuestaUsuario(false);
        return colaEsperaRepository.save(ce);
    }

    @Override
    @Transactional
    public void salir(Long turnoId, Long usuarioId) {
        colaEsperaRepository.deleteByTurnoIdAndUsuarioId(turnoId, usuarioId);
    }
    @Override
    public void enviarAviso(Long turnoId, Long usuarioId) {
        Optional<ColaEsperaTurno> ceOpt = colaEsperaRepository.findByTurnoIdAndUsuarioId(turnoId, usuarioId);
        if (ceOpt.isPresent() && !ceOpt.get().getAvisoEnviado() && !ceOpt.get().getRespuestaUsuario()) {
            Usuario usuario = ceOpt.get().getUsuario();
            emailService.sendMessageMail(usuario.getEmail(),"Aviso de turno http://localhost:5173/ConfirmarColaTurno/" + turnoId + "/" + usuarioId);
        } else {
            throw new RuntimeException("El usuario no está en la cola de espera");
        }
    }
    @Override
    public void intentarAvisarAlSiguiente(Long turnoId) {
    // Buscamos el primero en la cola (por ejemplo, el de menor posición) 
    // que cumpla con !avisoEnviado y !respuestaUsuario
    Optional<ColaEsperaTurno> siguiente = colaEsperaRepository.findFirstByTurnoIdAndAvisoEnviadoFalseOrderByPosicionEnColaAsc(turnoId);
    
    if (siguiente.isPresent()) {
        ColaEsperaTurno cola = siguiente.get();
        enviarAviso(turnoId, cola.getUsuario().getId());
        cola.setAvisoEnviado(true);
        colaEsperaRepository.save(cola);
    }
}
    @Override
    @Transactional
    public void recibirRespuesta(Long turnoId, Long usuarioId, boolean respuesta) {
        Optional<ColaEsperaTurno> ceOpt = colaEsperaRepository.findByTurnoIdAndUsuarioId(turnoId, usuarioId);
        if (ceOpt.isPresent()) {
            ColaEsperaTurno ce = ceOpt.get();
            ce.setRespuestaUsuario(respuesta);
            colaEsperaRepository.save(ce);
            if (!respuesta) {
                avisarAlSiguiente(turnoId, ce.getPosicionEnCola());
            }
        } else {
            throw new RuntimeException("El usuario no está en la cola de espera");
        }
    }
    private void avisarAlSiguiente(Long turnoId, int posicionActual) {
    Optional<ColaEsperaTurno> siguiente = colaEsperaRepository.findByTurnoIdAndPosicionEnCola(turnoId, posicionActual + 1);
    
    if (siguiente.isPresent()) {
        ColaEsperaTurno sig = siguiente.get(); 
        enviarAviso(turnoId, sig.getUsuario().getId());
        sig.setAvisoEnviado(true);
        colaEsperaRepository.save(sig);
    } else {
        System.out.println("No hay más usuarios en la cola para este turno.");
    }
    }
    @Override
    public Optional<ColaEsperaTurno> obtenerSiguiente(Long turnoId) {
        return colaEsperaRepository.findFirstByTurnoIdOrderByIdAsc(turnoId);
    }

    @Override
    @Transactional
    public Optional<ColaEsperaTurno> procesarSiguiente(Long turnoId) {
        Optional<ColaEsperaTurno> proximo = obtenerSiguiente(turnoId   );
        proximo.ifPresent(ce -> colaEsperaRepository.delete(ce));
        return proximo;
    }

    @Override
    public int cantidad(Long turnoId) {
        return colaEsperaRepository.countByTurnoId(turnoId);
    }

    @Override
    public boolean estaEnCola(Long turnoId, Long usuarioId) {
        return colaEsperaRepository.existsByTurnoIdAndUsuarioId(turnoId, usuarioId);
    }

    @Override
    public List<ColaEsperaTurno> listar(Long turnoId) {
        return colaEsperaRepository.findByTurnoIdOrderByIdAsc(turnoId);
    }
}
