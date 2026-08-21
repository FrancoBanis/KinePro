package com.AMDevs.inge2.service;

import com.AMDevs.inge2.entity.ColaEsperaRutina;
import java.util.List;
import java.util.Optional;

public interface ColaEsperaRutinaService {
    ColaEsperaRutina agregar(Long rutinaId, Long usuarioId);
    void salir(Long rutinaId, Long usuarioId);
    void enviarAviso(Long rutinaId, Long usuarioId);
    void recibirRespuesta(Long rutinaId, Long usuarioId, boolean respuesta);
    void intentarAvisarAlSiguiente(Long rutinaId);
    Optional<ColaEsperaRutina> obtenerSiguiente(Long rutinaId);
    Optional<ColaEsperaRutina> procesarSiguiente(Long rutinaId);
    int cantidad(Long rutinaId);
    boolean estaEnCola(Long rutinaId, Long usuarioId);
    List<ColaEsperaRutina> listar(Long rutinaId);
}