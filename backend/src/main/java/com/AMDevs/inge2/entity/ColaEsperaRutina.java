package com.AMDevs.inge2.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class ColaEsperaRutina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "id_rutina")
    @JsonBackReference 
    private Rutina rutina;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(name = "posicion")
    private Integer posicionEnCola;

    @Column(name = "aviso_enviado")
    private Boolean avisoEnviado;

    @Column(name = "respuesta_usuario")
    private Boolean respuestaUsuario;

    @Column(name = "indice")
    private Integer indice;

    public ColaEsperaRutina() {
        this.indice = 0;
    }

    public ColaEsperaRutina(Rutina rutina, Usuario usuario) {
        this.rutina = rutina;
        this.usuario = usuario;
        this.indice = 0;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Rutina getRutina() {
        return rutina;
    }

    public void setRutina(Rutina rutina) {
        this.rutina = rutina;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Integer getPosicionEnCola() {
        return posicionEnCola;
    }

    public void setPosicionEnCola(Integer posicionEnCola) {
        this.posicionEnCola = posicionEnCola;
    }

    public Boolean getAvisoEnviado() {
        return avisoEnviado;
    }

    public void setAvisoEnviado(Boolean avisoEnviado) {
        this.avisoEnviado = avisoEnviado;
    }

    public Boolean getRespuestaUsuario() {
        return respuestaUsuario;
    }

    public void setRespuestaUsuario(Boolean respuestaUsuario) {
        this.respuestaUsuario = respuestaUsuario;
    }

    public Integer getIndice() {
        return indice;
    }

    public void setIndice(Integer indice) {
        this.indice = indice;
    }
}