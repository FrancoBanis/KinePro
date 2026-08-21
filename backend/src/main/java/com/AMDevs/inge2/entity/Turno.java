package com.AMDevs.inge2.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Turno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    @Column (name = "cupo_max_pacientes")
    private Integer cupoMaxPacientes;
    private Boolean activa = true;
    private Integer maxProfesionales;

    @ManyToOne
    @JoinColumn(name = "rutina_id")
    @JsonBackReference
        private Rutina rutina;

    @OneToMany(mappedBy = "turno", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<TurnoPaciente> inscripciones = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "turno_profesionales",
            joinColumns = @JoinColumn(name = "turno_id"),
            inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private List<Usuario> profesionales = new ArrayList<>();
    @OneToMany(mappedBy = "turno", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ColaEsperaTurno> colaEspera = new ArrayList<>(); 
    public Turno() {
    }

    public Turno (String nombre, LocalDate fecha, LocalTime horaInicio, LocalTime horaFin,Rutina rutina){
        this.nombre=nombre;
        this.fecha=fecha;
        this.horaInicio=horaInicio;
        this.horaFin=horaFin;
        this.rutina=rutina;
    }

    public Turno(String dia, String hora, Rutina rutina) {
        this.nombre = dia;
        if (hora != null && !hora.isEmpty()) this.horaInicio = java.time.LocalTime.parse(hora);
        this.rutina = rutina;
        this.cupoMaxPacientes = rutina.getCupoMaxPacientesPorTurno();
    }

    public Long getId() {
        return id;
    }
    @JsonProperty("id_rutina")
    public Long getIdRutina() {
        return rutina != null ? rutina.getId() : null;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }

    public Integer getCupoMaxPacientes() {
        return cupoMaxPacientes;
    }

    public void setCupoMaxPacientes(Integer cupoMaxPacientes) {
        this.cupoMaxPacientes = cupoMaxPacientes;
    }

    public Rutina getRutina() {
        return rutina;
    }

    public void setRutina(Rutina rutina) {
        this.rutina = rutina;
    }

    // Devuelve todos los pacientes inscriptos (directos y por rutina), para
    // mantener la misma forma de respuesta que consume el frontend.
    @JsonProperty("pacientes")
    public List<Usuario> getPacientes() {
        return inscripciones.stream().map(TurnoPaciente::getUsuario).toList();
    }

    public List<Usuario> getPacientesDesdeRutina() {
        return inscripciones.stream()
                .filter(TurnoPaciente::isDesdeRutina)
                .map(TurnoPaciente::getUsuario)
                .toList();
    }

    public List<Usuario> getProfesionales() {
        return profesionales;
    }

    public void setProfesionales(List<Usuario> profesionales) {
        this.profesionales = profesionales;
    }

    // Cupo ocupado: solo cuenta inscripciones directas, no las que vienen de
    // anotarse a la rutina completa (esas no deben afectar el cupo del turno).
    @JsonProperty("cantidadDePacientesActuales")
    public int getCantidadDePacientesActuales() {
        return (int) inscripciones.stream().filter(tp -> !tp.isDesdeRutina()).count();
    }

    public boolean turno_lleno() {
        return getCantidadDePacientesActuales() >= cupoMaxPacientes;
    }

    public boolean tienePaciente(Usuario usuario) {
        return inscripciones.stream().anyMatch(tp -> tp.getUsuario().getId().equals(usuario.getId()));
    }

    public void agregarPaciente(Usuario usuario, boolean desdeRutina) {
        inscripciones.add(new TurnoPaciente(this, usuario, desdeRutina));
    }

    public void quitarPaciente(Usuario usuario) {
        inscripciones.removeIf(tp -> tp.getUsuario().getId().equals(usuario.getId()));
    }

    // Compatibility getters used by frontend
    public String getDia() {
        return this.nombre;
    }

    public String getHora() {
        return this.horaInicio != null ? this.horaInicio.toString() : null;
    }

    public Boolean getActiva() {
        return this.activa;
    }
    public List<ColaEsperaTurno> getColaEspera() {
        return colaEspera;
    }

    public void setColaEspera(List<ColaEsperaTurno> colaEspera) {
        this.colaEspera = colaEspera;
    }
        public void agregarACola(ColaEsperaTurno ce) {
        colaEspera.add(ce);
        ce.setRutina(this);
    }

    public void quitarDeCola(ColaEsperaTurno ce) {
        colaEspera.remove(ce);
        ce.setRutina(null);
    }

    public void setActiva(Boolean activa) {
        this.activa = activa;
    }

    public Integer getMaxProfesionales() {
        return this.maxProfesionales;
    }

    public void setMaxProfesionales(Integer maxProfesionales) {
        this.maxProfesionales = maxProfesionales;
    }

}
