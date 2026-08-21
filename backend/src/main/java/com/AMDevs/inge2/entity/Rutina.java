package com.AMDevs.inge2.entity;

import jakarta.persistence.*;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
public class Rutina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "tipo_rutina_id", nullable = false)
    private TipoRutina tipo;
    
    private String nombresDeProfesionales;

    @Enumerated(EnumType.STRING)
    private DayOfWeek diaSemana;

    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private LocalTime horaInicio;
    private LocalTime horaFin; 

    private Integer cupoMaxPacientesPorTurno;
    private Integer cupoMaxRutina;

    private Boolean activa;
    private Double costoPorTurno;

    @OneToMany(mappedBy = "rutina", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Turno> turnos = new ArrayList<>();

    
    @ManyToMany
    @JoinTable(
        name = "rutina_pacientes",
        joinColumns = @JoinColumn(name = "rutina_id"),
        inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private List<Usuario> pacientesRutina = new ArrayList<>();
    /*@OneToMany(mappedBy = "rutina", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ColaEspera> colaEspera = new ArrayList<>();
*/
    public Rutina() {}

    public Rutina(String nombre, String nombresDeProfesionales, TipoRutina tipoDeRutina, String fechaDeInicio, String fechaDeFin, Integer cupoMaxPacientesPorTurno, Integer cupoMaxRutina, double costoPorTurno) {
        this.nombre = nombre;
        this.nombresDeProfesionales = nombresDeProfesionales;
        this.tipo = tipoDeRutina;
        if (fechaDeInicio != null && !fechaDeInicio.isEmpty()) this.fechaInicio = LocalDate.parse(fechaDeInicio);
        if (fechaDeFin != null && !fechaDeFin.isEmpty()) this.fechaFin = LocalDate.parse(fechaDeFin);
        this.cupoMaxPacientesPorTurno = cupoMaxPacientesPorTurno;
        this.cupoMaxRutina = cupoMaxRutina;
        this.costoPorTurno = costoPorTurno;
        this.activa = true;
    }

    public Long getId() {
        return id;
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

    public TipoRutina getTipo() {
        return this.tipo;
    }

    public void setTipo(TipoRutina tipo) {
        this.tipo = tipo; 
    }

    public String getNombresDeProfesionales() {
        return nombresDeProfesionales;
    }

    public void setNombresDeProfesionales(String nombresDeProfesionales) {
        this.nombresDeProfesionales = nombresDeProfesionales;
    }

    public DayOfWeek getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(DayOfWeek diaSemana) {
        this.diaSemana = diaSemana;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
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

    public Integer getCupoMaxPacientesPorTurno() {
        return cupoMaxPacientesPorTurno;
    }
    @JsonProperty("capacidadMaxima")
    public Integer getCapacidadMaxima() {
        return cupoMaxPacientesPorTurno;
    }
    public void setCupoMaxPacientesPorTurno(Integer cupo) {
        this.cupoMaxPacientesPorTurno = cupo;
    }

    public Integer getCupoMaxRutina() {
        return cupoMaxRutina;
    }

    public void setCupoMaxRutina(Integer cupoMaxRutina) {
        this.cupoMaxRutina = cupoMaxRutina;
    }
    
    @JsonProperty("cantidadPacientesRutina")
    public int getCantidadPacientesRutina() {
        return (int) turnos.stream()
                .flatMap(t -> t.getPacientesDesdeRutina().stream())
                .map(Usuario::getId)
                .distinct()
                .count();
    }

    public Boolean getActiva() {
        return activa;
    }

    public void setActiva(Boolean activa) {
        this.activa = activa;
    }

    public Double getCostoPorTurno() {
        return costoPorTurno;
    }

    public void setCostoPorTurno(Double costoPorTurno) {
        this.costoPorTurno = costoPorTurno;
    }

    public List<Turno> getTurnos() {
        return turnos;
    }


    public void setTurnos(List<Turno> turnos) {
        this.turnos = turnos;
    }



    public String getFechaDeInicio() {
        return this.fechaInicio != null ? this.fechaInicio.toString() : null;
    }

    public String getFechaDeFin() {
        return this.fechaFin != null ? this.fechaFin.toString() : null;
    }

    public void agregarTurno(Turno turno) {
        turnos.add(turno);
        turno.setRutina(this);
    }

    public void quitarTurno(Turno turno) {
        turnos.remove(turno);
        turno.setRutina(null);
    }

    public List<Usuario> getPacientesRutina() {
        return pacientesRutina;
    }

    public void setPacientesRutina(List<Usuario> pacientesRutina) {
        this.pacientesRutina = pacientesRutina;
    }
    
    public void agregarPacienteRutina(Usuario usuario) {
        this.pacientesRutina.add(usuario);
    }
/*
    @JsonProperty("cantidadPacientesRutina")
    public int getCantidadPacientesRutina() {
        return pacientesRutina.size();
    }
         */
    /*
    public void agregarACola(ColaEspera ce) {
        colaEspera.add(ce);
        ce.setRutina(this);
    }

    public void quitarDeCola(ColaEspera ce) {
        colaEspera.remove(ce);
        ce.setRutina(null);
    }
         */
}