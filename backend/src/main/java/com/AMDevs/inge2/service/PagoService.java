package com.AMDevs.inge2.service;

import com.AMDevs.inge2.dto.PagoHistorialDTO;
import com.AMDevs.inge2.dto.PagoClinicaHistorialDTO;
import com.AMDevs.inge2.dto.PagoClinicaPaginaDTO;
import com.AMDevs.inge2.entity.Pago;
import com.AMDevs.inge2.entity.Usuario;
import com.AMDevs.inge2.repository.PagoRepository;
import com.AMDevs.inge2.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

@Service
public class PagoService {

    private static final int PAGOS_POR_PAGINA = 50;

    private final PagoRepository pagoRepository;
    private final UsuarioRepository usuarioRepository;
    private final RutinaService rutinaService;
    private final TurnoService turnoService;

    public PagoService(
            PagoRepository pagoRepository,
            UsuarioRepository usuarioRepository,
            RutinaService rutinaService,
            TurnoService turnoService
    ) {
        this.pagoRepository = pagoRepository;
        this.usuarioRepository = usuarioRepository;
        this.rutinaService = rutinaService;
        this.turnoService = turnoService;
    }

    public boolean existePorMercadoPagoId(Long mercadoPagoId) {
        return pagoRepository.existsByMercadoPagoId(mercadoPagoId);
    }

    @Transactional
    public void registrarPago(
            Long mercadoPagoId,
            Long usuarioId,
            String tipo,
            Long itemId,
            BigDecimal monto,
            OffsetDateTime fechaAprobacion
    ) {
        if (pagoRepository.existsByMercadoPagoId(mercadoPagoId)) return;

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String concepto = switch (tipo) {
            case "rutina" -> rutinaService.buscarRutina(itemId).getNombre();
            case "turno" -> turnoService.buscarRutinaDeturno(itemId).getNombre();
            default -> throw new RuntimeException("Tipo de pago no reconocido: " + tipo);
        };

        LocalDateTime fecha = fechaAprobacion != null
                ? fechaAprobacion.toLocalDateTime()
                : LocalDateTime.now();

        pagoRepository.save(new Pago(
                mercadoPagoId,
                fecha,
                monto,
                concepto,
                tipo,
                itemId,
                usuario.getEmail()
        ));
    }

    @Transactional(readOnly = true)
    public List<PagoHistorialDTO> obtenerHistorialPersonal(String usuarioEmail) {
        return pagoRepository.findByUsuarioEmailIgnoreCaseOrderByFechaDesc(usuarioEmail)
                .stream()
                .map(pago -> new PagoHistorialDTO(
                        pago.getMercadoPagoId(),
                        pago.getFecha(),
                        pago.getMonto(),
                        pago.getConcepto()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public PagoClinicaPaginaDTO obtenerHistorialClinica(int pagina) {
        Page<Pago> paginaPagos = pagoRepository.findAllByOrderByFechaDesc(
                PageRequest.of(Math.max(pagina, 0), PAGOS_POR_PAGINA)
        );

        List<PagoClinicaHistorialDTO> pagos = paginaPagos.getContent()
                .stream()
                .map(pago -> new PagoClinicaHistorialDTO(
                        pago.getMercadoPagoId(),
                        obtenerNombreUsuario(pago.getUsuarioEmail()),
                        pago.getUsuarioEmail(),
                        pago.getMonto(),
                        pago.getConcepto(),
                        pago.getFecha()
                ))
                .toList();

        return new PagoClinicaPaginaDTO(
                pagos,
                paginaPagos.getNumber(),
                paginaPagos.getTotalPages(),
                paginaPagos.getTotalElements()
        );
    }

    private String obtenerNombreUsuario(String usuarioEmail) {
        return usuarioRepository.findByEmail(usuarioEmail)
                .map(usuario -> {
                    String nombre = usuario.getNombre() == null ? "" : usuario.getNombre().trim();
                    String apellido = usuario.getApellido() == null ? "" : usuario.getApellido().trim();
                    String nombreCompleto = (nombre + " " + apellido).trim();
                    return nombreCompleto.isBlank() ? "Usuario sin nombre" : nombreCompleto;
                })
                .orElse("Usuario no registrado");
    }
}
