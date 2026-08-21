package com.AMDevs.inge2.repository;

import com.AMDevs.inge2.entity.Turno;
import com.AMDevs.inge2.entity.Usuario;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface TurnoRepository extends JpaRepository<Turno, Long> {
    public Optional<Turno> findById(long id);

    @Query(value = """
            SELECT DISTINCT t.*
            FROM turno t
            INNER JOIN turno_paciente tp ON tp.turno_id = t.id
            WHERE tp.usuario_id = :usuarioId
            """, nativeQuery = true)
    List<Turno> findTurnosByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM Turno t " +
            "WHERE t.fecha >= CURRENT_DATE AND t.activa = true AND (" +
            "EXISTS (SELECT 1 FROM TurnoPaciente tp WHERE tp.turno = t AND tp.usuario = :usuario) " +
            "OR :usuario MEMBER OF t.profesionales)")
    boolean existsTurnoActivoParaUsuario(@Param("usuario") Usuario usuario);
    
    @Query(value = """
            SELECT DISTINCT t.*
            FROM turno t
            INNER JOIN turno_profesionales tp ON tp.turno_id = t.id
            WHERE tp.usuario_id = :usuarioId
            """, nativeQuery = true)
    List<Turno> findTurnosProfesionalesByUsuarioId(@Param("usuarioId") Long usuarioId);
}
