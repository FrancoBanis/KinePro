package com.AMDevs.inge2.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class TurnoPaciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "turno_id")
    @JsonBackReference
    private Turno turno;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(name = "desde_rutina", nullable = false)
    private boolean desdeRutina = false;

    public TurnoPaciente() {}

    public TurnoPaciente(Turno turno, Usuario usuario, boolean desdeRutina) {
        this.turno = turno;
        this.usuario = usuario;
        this.desdeRutina = desdeRutina;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Turno getTurno() {
        return turno;
    }

    public void setTurno(Turno turno) {
        this.turno = turno;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public boolean isDesdeRutina() {
        return desdeRutina;
    }

    public void setDesdeRutina(boolean desdeRutina) {
        this.desdeRutina = desdeRutina;
    }
}
