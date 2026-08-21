package com.AMDevs.inge2.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pago")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mercado_pago_id", nullable = false, unique = true)
    private Long mercadoPagoId;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal monto;

    @Column(nullable = false)
    private String concepto;

    @Column(nullable = false)
    private String tipo;

    @Column(name = "item_id", nullable = false)
    private Long itemId;

    @Column(name = "usuario_email", nullable = false)
    private String usuarioEmail;

    public Pago() {}

    public Pago(
            Long mercadoPagoId,
            LocalDateTime fecha,
            BigDecimal monto,
            String concepto,
            String tipo,
            Long itemId,
            String usuarioEmail
    ) {
        this.mercadoPagoId = mercadoPagoId;
        this.fecha = fecha;
        this.monto = monto;
        this.concepto = concepto;
        this.tipo = tipo;
        this.itemId = itemId;
        this.usuarioEmail = usuarioEmail;
    }

    public Long getId() {
        return id;
    }

    public Long getMercadoPagoId() {
        return mercadoPagoId;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public String getConcepto() {
        return concepto;
    }

    public String getTipo() {
        return tipo;
    }

    public Long getItemId() {
        return itemId;
    }

    public String getUsuarioEmail() {
        return usuarioEmail;
    }
}
