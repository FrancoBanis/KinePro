/*
agregar(rutinaId, usuarioId): Verifica si el usuario ya está en la cola (estaEnCola). Si no, busca Rutina y Usuario en base de datos, crea la entidad ColaEspera y la persiste.
salir(rutinaId, usuarioId): Elimina el registro que coincida con esa rutina y ese usuario.
obtenerSiguiente(rutinaId): Busca el primer registro por id ascendente (el que lleva más tiempo esperando).
procesarSiguiente(rutinaId): Obtiene el siguiente y lo elimina de la cola (pop). Devuelve el elemento eliminado.
cantidad(rutinaId): Cuenta cuántos registros hay para esa rutina.
estaEnCola(rutinaId, usuarioId): Consulta si existe un registro con esa combinación.
listar(rutinaId): Trae todos los registros ordenados por id ascendente. */


package com.AMDevs.inge2.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
public class ColaEsperaTurno {

    // ID que representa el orden de ingreso a la cola
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // ID de la rutina
    @ManyToOne
    @JoinColumn(name = "id_turno")
    @JsonBackReference 
    private Turno turno;

    // ID del usuario. Las tres id aparecen en la misma fila al anotarse.
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    @JoinColumn(name = "posicion")
    private Integer posicionEnCola;
    @JoinColumn(name = "aviso_enviado")
    private Boolean avisoEnviado;
    @JoinColumn(name = "respuesta_usuario")
    private Boolean respuestaUsuario;
    public Integer getPosicionEnCola() {
        return posicionEnCola;
    }
    @JoinColumn(name = "indice")
    private Integer indice;
    public Integer getIndice() {
        return indice;
    }


    public void setIndice(Integer indice) {
        this.indice = indice;
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

    public ColaEsperaTurno() {
        this.indice = 0;
    }

    public ColaEsperaTurno(Turno turno,Usuario usuario) {
        this.turno = turno;
        this.usuario = usuario;
        this.indice = 0;
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

    public void setRutina(Turno turno) {
        this.turno = turno;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
