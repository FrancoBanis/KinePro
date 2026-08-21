package com.AMDevs.inge2.repository;

import com.AMDevs.inge2.entity.TipoRutina;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

 
public interface TipoRutinaRepository extends JpaRepository<TipoRutina, Long> {
    public Optional<TipoRutina> findById(Long id); 
    Optional<TipoRutina> findByNombreIgnoreCase(String nombre);
    boolean existsByNombreIgnoreCase(String nombre);
    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);

}
