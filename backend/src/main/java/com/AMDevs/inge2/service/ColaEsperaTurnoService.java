package com.AMDevs.inge2.service;

import com.AMDevs.inge2.entity.ColaEsperaTurno;

import java.util.List;
import java.util.Optional;

/*
agregar(rutinaId, usuarioId): Verifica si el usuario ya está en la cola (estaEnCola). Si no, busca Rutina y Usuario en base de datos, crea la entidad ColaEspera y la persiste.
salir(rutinaId, usuarioId): Elimina el registro que coincida con esa rutina y ese usuario.
obtenerSiguiente(rutinaId): Busca el primer registro por id ascendente (el que lleva más tiempo esperando).
procesarSiguiente(rutinaId): Obtiene el siguiente y lo elimina de la cola (pop). Devuelve el elemento eliminado.
cantidad(rutinaId): Cuenta cuántos registros hay para esa rutina.
estaEnCola(rutinaId, usuarioId): Consulta si existe un registro con esa combinación.
listar(rutinaId): Trae todos los registros ordenados por id ascendente. */

public interface ColaEsperaTurnoService {
    ColaEsperaTurno agregar(Long turnoId, Long usuarioId);
    void salir(Long turnoId, Long usuarioId);
    void enviarAviso(Long turnoId, Long usuarioId);
    void recibirRespuesta(Long turnoId, Long usuarioId, boolean respuesta);
    public void intentarAvisarAlSiguiente(Long turnoId);
    Optional<ColaEsperaTurno> obtenerSiguiente(Long turnoId);
    Optional<ColaEsperaTurno> procesarSiguiente(Long turnoId);
    int cantidad(Long turnoId);
    boolean estaEnCola(Long turnoId, Long usuarioId);
    List<ColaEsperaTurno> listar(Long turnoId);
}
