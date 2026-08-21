package com.AMDevs.inge2.repository;

import com.AMDevs.inge2.entity.Pago;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PagoRepository extends JpaRepository<Pago, Long> {
    boolean existsByMercadoPagoId(Long mercadoPagoId);
    List<Pago> findByUsuarioEmailIgnoreCaseOrderByFechaDesc(String usuarioEmail);
    Page<Pago> findAllByOrderByFechaDesc(Pageable pageable);
}
