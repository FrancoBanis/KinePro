package com.AMDevs.inge2.repository;

import com.AMDevs.inge2.entity.ColaEsperaTurno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ColaEsperaTurnoRepository extends JpaRepository<ColaEsperaTurno, Long> {
    List<ColaEsperaTurno> findByTurnoIdOrderByIdAsc(Long turnoId);
    void deleteByTurnoIdAndUsuarioId(Long turnoId, Long usuarioId);
    boolean existsByTurnoIdAndUsuarioId(Long turnoId, Long usuarioId);
    int countByTurnoId(Long turnoId);
    Optional<ColaEsperaTurno> findFirstByTurnoIdOrderByIdAsc(Long turnoId);
    Optional<ColaEsperaTurno> findByTurnoIdAndUsuarioId(Long turnoId, Long usuarioId);
    Optional<ColaEsperaTurno> findByTurnoIdAndPosicionEnCola(Long turnoId, Integer posicionActual);
    Optional<ColaEsperaTurno> findFirstByTurnoIdAndAvisoEnviadoFalseOrderByPosicionEnColaAsc(Long turnoId);
}
