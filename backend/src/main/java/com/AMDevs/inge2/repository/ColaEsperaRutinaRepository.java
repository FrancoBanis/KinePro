package com.AMDevs.inge2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.AMDevs.inge2.entity.ColaEsperaRutina;
import java.util.List;
import java.util.Optional;

public interface ColaEsperaRutinaRepository extends JpaRepository<ColaEsperaRutina, Long> {
    int countByRutinaId(Long rutinaId);
    void deleteByRutinaIdAndUsuarioId(Long rutinaId, Long usuarioId);
    Optional<ColaEsperaRutina> findByRutinaIdAndUsuarioId(Long rutinaId, Long usuarioId);
    Optional<ColaEsperaRutina> findFirstByRutinaIdAndAvisoEnviadoFalseOrderByPosicionEnColaAsc(Long rutinaId);
    Optional<ColaEsperaRutina> findByRutinaIdAndPosicionEnCola(Long rutinaId, int posicionEnCola);
    Optional<ColaEsperaRutina> findFirstByRutinaIdOrderByIdAsc(Long rutinaId);
    boolean existsByRutinaIdAndUsuarioId(Long rutinaId, Long usuarioId);
    List<ColaEsperaRutina> findByRutinaIdOrderByIdAsc(Long rutinaId);
}