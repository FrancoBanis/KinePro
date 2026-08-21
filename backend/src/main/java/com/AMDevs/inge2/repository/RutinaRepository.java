package com.AMDevs.inge2.repository;

import com.AMDevs.inge2.entity.Rutina;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;

public interface RutinaRepository extends JpaRepository<Rutina, Long> {
    List<Rutina> findByActiva(Boolean activa);
    List<Rutina> findByDiaSemana(DayOfWeek diaSemana);
    List<Rutina> findByTipoIdAndActiva(Long tipoRutinaId, Boolean activa);
    List<Rutina> findByTipoId(Long tipoRutinaId);
    boolean existsByTipoIdAndActiva(Long tipoRutinaId, Boolean activa);
} 